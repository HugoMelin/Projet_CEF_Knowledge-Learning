const express = require('express');

const router = express.Router();

const invoiceController = require('../controllers/invoiceController');
const secure = require('../middleware/secure');

router.post('/', secure.checkIfVerify, invoiceController.createInvoice);

router.get('/', secure.checkAdminRole, invoiceController.getAllInvoices);

router.get('/:invoiceId', secure.checkAdminRole, invoiceController.getInvoiceById);

router.get('/user/:userId', secure.checkIfVerify, invoiceController.getInvoicesByUserId);

router.patch('/:invoiceId', secure.checkAdminRole, invoiceController.updateInvoice);

router.delete('/:invoiceId', secure.checkAdminRole, invoiceController.deleteInvoice);

module.exports = router;
