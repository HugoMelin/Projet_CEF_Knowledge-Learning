const express = require('express');

const router = express.Router();

const themeController = require('../controllers/themeController');
const secure = require('../middleware/secure');

router.post('/', themeController.createTheme);

router.get('/', themeController.getAllThemes);

module.exports = router;
