const express = require('express');

const router = express.Router();

const purchaseController = require('../controllers/purchaseController');
// const secure = require('../middleware/secure');

router.post('/', purchaseController.createPurchase);

router.get('/', purchaseController.getAllPurchases);

router.get('/:purchaseId', purchaseController.getPurchaseById);

router.get('/user/:userId', purchaseController.getPurchasesByUserId);

router.patch('/:purchaseId', purchaseController.updatePurchase);

router.delete('/:purchaseId', purchaseController.deletePurchase);

module.exports = router;
