const express = require('express');

const router = express.Router();

const certificationController = require('../controllers/certificationController');
// const secure = require('../middleware/secure');

router.post('/', certificationController.createCertification);

router.get('/', certificationController.getAllCertifications);

router.get('/:userId', certificationController.getCertificationsByUserId);

router.get('/:userId/:themeId', certificationController.getCertificationByUserIdAndThemeId);

router.delete('/:userId/:themeId', certificationController.deleteCertification);

router.patch('/:userId/:themeId', certificationController.updateCertification);

module.exports = router;
