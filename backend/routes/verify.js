const express = require('express');

const router = express.Router();

const verifyService = require('../services/verifyService');

router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const result = await verifyService.verifyUser(token);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Token de vérification invalide ou déjà utilisé') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send(error.message);
    }
  }
});

module.exports = router;
