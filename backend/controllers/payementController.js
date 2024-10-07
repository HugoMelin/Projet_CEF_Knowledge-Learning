const jwt = require('jsonwebtoken');
const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');

const { SECRET_KEY } = process.env;

/**
 * Controller for handling payment-related operations.
 * @class
 */
class PaymentController {
  /**
   * Create a PaymentController.
   * @param {Object} stripeService - The Stripe service for payment processing.
   */
  constructor(stripeService) {
    this.stripeService = stripeService;
  }

  /**
   * Creates a checkout session.
   * @async
   * @function createCheckoutSession
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   */
  async createCheckoutSession(req, res) {
    try {
      // Extract and verify JWT token
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

      // Create checkout session
      const { items } = req.body;
      const session = await this.stripeService.createCheckoutSession(
        items,
        `${req.protocol}://${req.get('host')}/api/create-checkout-session/success?session_id={CHECKOUT_SESSION_ID}`,
        `http://localhost:4200/payement-cancel`,
        `${idUser}`,
      );

      res.json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Handles successful checkout.
   * @async
   * @function handleSuccess
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   */
  async handleSuccess(req, res) {
    try {
      const { session_id } = req.query;
      const session = await this.stripeService.getSessionDetails(session_id);

      if (!session) {
        return res.status(404).json({ message: 'Session Stripe non trouvée' });
      }

      if (!session.line_items || !Array.isArray(session.line_items.data)) {
        return res.status(400).json({ message: 'Données de ligne invalides' });
      }

      // Create invoice
      const invoiceData = {
        idUser: session.client_reference_id,
        price: session.amount_total / 100,
      };
      const newInvoice = await Invoice.create(invoiceData);

      // Create purchases
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

      res.redirect('http://localhost:4200/payement-succes'); // Redirect to success page
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
