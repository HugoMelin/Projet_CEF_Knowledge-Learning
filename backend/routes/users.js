const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/', userController.createUser);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getOneUserById);

router.delete('/:id', userController.deleteUser);

router.patch('/:id', userController.updateUser);

module.exports = router;
