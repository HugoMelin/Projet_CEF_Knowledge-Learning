const express = require('express');

const router = express.Router();

const purchaseController = require('../controllers/purchaseController');
const secure = require('../middleware/secure');

router.post('/', secure.checkIfVerify, purchaseController.createPurchase);

router.get('/', secure.checkAdminRole, purchaseController.getAllPurchases);

router.get('/:purchaseId', secure.checkAdminRole, purchaseController.getPurchaseById);

router.get('/user/:userId', secure.checkUserRole, purchaseController.getPurchasesByUserId);

router.patch('/:purchaseId', secure.checkAdminRole, purchaseController.updatePurchase);

router.delete('/:purchaseId', secure.checkAdminRole, purchaseController.deletePurchase);

module.exports = router;
