const express = require('express');

const router = express.Router();

const themeController = require('../controllers/themeController');
const secure = require('../middleware/secure');

router.post('/', secure.checkAdminRole, themeController.createTheme);

router.get('/', themeController.getAllThemes);

router.get('/:id', themeController.getOneThemeById);

router.delete('/:id', secure.checkAdminRole, themeController.deleteTheme);

router.patch('/:id', secure.checkAdminRole, themeController.updateTheme);

module.exports = router;
