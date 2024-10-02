const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  constructor() {
    this.stripe = stripe;
  }

  async createCheckoutSession(items, successUrl, cancelUrl) {
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
          unit_amount: item.price * 100, // Stripe utilise les centimes
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  }

  async getSessionDetails(sessionId) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    return session;
  }

  async getProductDetails(productId) {
    const data = await this.stripe.products.retrieve(productId);
    return data;
  }
}

module.exports = StripeService;
