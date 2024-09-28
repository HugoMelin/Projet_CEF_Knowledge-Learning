const express = require('express');

const router = express.Router();

const themeController = require('../controllers/themeController');
// const secure = require('../middleware/secure');

router.post('/', themeController.createTheme);

router.get('/', themeController.getAllThemes);

router.get('/:id', themeController.getOneThemeById);

router.delete('/:id', themeController.deleteTheme);

router.patch('/:id', themeController.updateTheme);

module.exports = router;
