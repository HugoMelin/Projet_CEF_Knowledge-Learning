const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Service for handling Stripe payment operations.
 * @class
 */
class StripeService {
  /**
   * Create a StripeService.
   * @constructor
   */
  constructor() {
    this.stripe = stripe;
  }

  /**
   * Create a Stripe checkout session.
   * @async
   * @param {Array} items - Array of items to be purchased.
   * @param {string} successUrl - URL to redirect to on successful payment.
   * @param {string} cancelUrl - URL to redirect to on cancelled payment.
   * @param {string|number} userId - ID of the user making the purchase.
   * @returns {Promise<Object>} Stripe session object.
   * @throws {Error} If there's an error creating the session.
   */
  async createCheckoutSession(items, successUrl, cancelUrl, userId) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              metadata: {
                type: item.type,
                id: item.id.toString(),
              },
            },
            unit_amount: item.price * 100, // Stripe uses cents
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId.toString(),
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Retrieve details of a Stripe session.
   * @async
   * @param {string} sessionId - ID of the Stripe session.
   * @returns {Promise<Object>} Detailed session object.
   * @throws {Error} If there's an error retrieving the session details.
   */
  async getSessionDetails(sessionId) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer'],
      });
      return session;
    } catch (error) {
      console.error('Error retrieving session details:', error);
      throw error;
    }
  }

  /**
   * Retrieve details of a Stripe product.
   * @async
   * @param {string} productId - ID of the Stripe product.
   * @returns {Promise<Object>} Product details.
   * @throws {Error} If there's an error retrieving the product details.
   */
  async getProductDetails(productId) {
    try {
      const data = await this.stripe.products.retrieve(productId);
      return data;
    } catch (error) {
      console.error('Error retrieving product details:', error);
      throw error;
    }
  }
}

module.exports = StripeService;
