const express = require('express');

const router = express.Router();

const invoiceController = require('../controllers/invoiceController');
// const secure = require('../middleware/secure');

router.post('/', invoiceController.createInvoice);

router.get('/', invoiceController.getAllInvoices);

router.get('/:invoiceId', invoiceController.getInvoiceById);

router.get('/user/:userId', invoiceController.getInvoicesByUserId);

router.patch('/:invoiceId', invoiceController.updateInvoice);

router.delete('/:invoiceId', invoiceController.deleteInvoice);

module.exports = router;
