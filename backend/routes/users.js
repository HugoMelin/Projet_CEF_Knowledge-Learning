const express = require('express');

const usersCtrl = require('../services/users');

const router = express.Router();

router.post('/', async (req, res) => {
  const userData = req.body;
  try {
    const newUser = await usersCtrl.createUser(userData);
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: newUser,
    });
  } catch (error) {
    if (error.message === 'Un utilisateur avec cet email existe déjà'
      || error.message === 'Cet email est déjà utilisé') {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).send(error.message);
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await usersCtrl.getAllusers();
    res.status(200).json(users);
  } catch (error) {
    if (error.message === 'Aucun utilisateur trouvé') {
      res.status(204).json({ message: error.message });
    } else {
      res.status(500).send(error.message);
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersCtrl.getUser(id);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === 'Utilisateur non trouvé') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).send(error.message);
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersCtrl.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Utilisateur non trouvé') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).send(error.message);
    }
  }
});

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
