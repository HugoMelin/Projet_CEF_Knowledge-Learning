class PaymentController {
  constructor(stripeService) {
    this.stripeService = stripeService;
  }

  async createCheckoutSession(req, res) {
    try {
      const { items } = req.body;
      const session = await this.stripeService.createCheckoutSession(
        items,
        `${req.protocol}://${req.get('host')}/success`,
        `${req.protocol}://${req.get('host')}/cancel`,
      );

      res.json({ sessionId: session });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PaymentController;
