const { json } = require("express");
const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');

class PaymentController {
  constructor(stripeService) {
    this.stripeService = stripeService;
  }

  async createCheckoutSession(req, res) {
    try {
      const { items } = req.body;
      const session = await this.stripeService.createCheckoutSession(
        items,
        `${req.protocol}://${req.get('host')}/api/create-checkout-session/success?session_id={CHECKOUT_SESSION_ID}`,
        `${req.protocol}://${req.get('host')}/cancel`,
      );

      res.json({ sessionId: session });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleSuccess(req, res) {
    try {
      // eslint-disable-next-line camelcase
      const { session_id } = req.query;
      const session = await this.stripeService.getSessionDetails(session_id);

      // Création de la facture
      const invoiceData = {
        idUser: session.client_reference_id || 1,
        price: session.amount_total / 100,
      };
      const newInvoice = await Invoice.create(invoiceData);

      // Créer les achats
      await Promise.all(session.line_items.data.map(async (item) => {
        const productData = await this.stripeService.getProductDetails(item.price.product);

        const purchaseData = {
          idUser: session.client_reference_id || 1,
          idInvoice: newInvoice.idInvoice,
          idCourses: productData.metadata.type === 'course' ? productData.metadata.id : null,
          idLessons: productData.metadata.type === 'lesson' ? productData.metadata.id : null,
        };

        return Purchase.create(purchaseData);
      }));

      console.log(newInvoice);

      res.redirect('/success-page'); // Redirigez vers une page de succès
    } catch (error) {
      console.error('Erreur lors du traitement du succès du paiement:', error);
      res.status(500).send('Une erreur est survenue lors du traitement du paiement');
    }
  }
}

module.exports = PaymentController;
