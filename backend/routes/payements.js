const express = require('express');
const StripeService = require('../services/stripeService');
const PaymentController = require('../controllers/payementController');

const router = express.Router();

const stripeService = new StripeService();
const paymentController = new PaymentController(stripeService);

router.post('/', paymentController.createCheckoutSession.bind(paymentController));

module.exports = router;
