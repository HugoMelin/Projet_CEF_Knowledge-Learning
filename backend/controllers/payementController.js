const jwt = require('jsonwebtoken');

const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');

const { SECRET_KEY } = process.env;

class PaymentController {
  constructor(stripeService) {
    this.stripeService = stripeService;
  }

  async createCheckoutSession(req, res) {
    try {
      let token = req.cookies.token || req.headers.authorization;
      if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded.user;

      const { idUser } = req.user;

      const { items } = req.body;
      const session = await this.stripeService.createCheckoutSession(
        items,
        `${req.protocol}://${req.get('host')}/api/create-checkout-session/success?session_id={CHECKOUT_SESSION_ID}`,
        `${req.protocol}://${req.get('host')}/cancel`,
        `${idUser}`,
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

      if (!session) {
        return res.status(404).json({ message: 'Session Stripe non trouvée' });
      }

      if (!session.line_items || !Array.isArray(session.line_items.data)) {
        return res.status(400).json({ message: 'Données de ligne invalides' });
      }

      console.log(session.client_reference_id);
      // Création de la facture
      const invoiceData = {
        idUser: session.client_reference_id,
        price: session.amount_total / 100,
      };
      const newInvoice = await Invoice.create(invoiceData);

      // Créer les achats
      await Promise.all(session.line_items.data.map(async (item) => {
        const productData = await this.stripeService.getProductDetails(item.price.product);

        const purchaseData = {
          idUser: session.client_reference_id,
          idInvoice: newInvoice.idInvoice,
          idCourses: productData.metadata.type === 'course' ? productData.metadata.id : null,
          idLessons: productData.metadata.type === 'lesson' ? productData.metadata.id : null,
        };

        return Purchase.create(purchaseData);
      }));

      res.redirect('/success-page'); // Redirigez vers une page de succès
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Token invalide' });
      }
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expiré' });
      }
      return res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
    }
  }
}

module.exports = PaymentController;
