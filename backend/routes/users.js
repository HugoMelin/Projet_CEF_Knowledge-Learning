const express = require('express');

const usersCtrl = require('../services/users');

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/', userController.createUser);

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getOneUserById);

router.delete('/:id', userController.deleteUser);

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    // Appel de la fonction updateUser
    const updatedUser = await usersCtrl.updateUser(id, userData);

    // Renvoi de la réponse
    res.status(200).json({
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
