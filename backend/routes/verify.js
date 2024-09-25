const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.get('/:token', userController.verifyUser);

module.exports = router;
