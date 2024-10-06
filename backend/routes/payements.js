const express = require('express');
const StripeService = require('../services/stripeService');
const PaymentController = require('../controllers/payementController');

const router = express.Router();

const stripeService = new StripeService();
const paymentController = new PaymentController(stripeService);

const secure = require('../middleware/secure');

router.post('/', secure.checkIfVerify, paymentController.createCheckoutSession.bind(paymentController));

router.get('/success', paymentController.handleSuccess.bind(paymentController));

module.exports = router;
