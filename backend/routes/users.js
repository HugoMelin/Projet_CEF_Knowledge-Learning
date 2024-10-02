const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const secure = require('../middleware/secure');

router.post('/', userController.createUser);

// router.get('/', secure.checkAdminRole, userController.getAllUsers);

router.get('/:id', secure.checkAdminRole, userController.getOneUserById);

router.delete('/:id', userController.deleteUser);

router.patch('/:id', userController.updateUser);

router.post('/authenticate', userController.authenticate);

module.exports = router;
