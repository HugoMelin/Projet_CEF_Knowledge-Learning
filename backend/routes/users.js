const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const secure = require('../middleware/secure');

router.post('/', userController.createUser);

router.get('/', secure.checkAdminRole, userController.getAllUsers);

router.get('/:id', secure.checkJWT, userController.getOneUserById);

router.delete('/:id', secure.checkAdminRole, userController.deleteUser);

router.patch('/:id', secure.checkAdminRole, userController.updateUser);

router.post('/authenticate', userController.authenticate);

module.exports = router;
