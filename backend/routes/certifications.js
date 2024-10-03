const express = require('express');

const router = express.Router();

const certificationController = require('../controllers/certificationController');
const secure = require('../middleware/secure');

router.post('/', secure.checkUserRole, certificationController.createCertification);

router.get('/', secure.checkAdminRole, certificationController.getAllCertifications);

router.get('/:userId', secure.checkUserRole, certificationController.getCertificationsByUserId);

router.get('/:userId/:themeId', secure.checkUserRole, certificationController.getCertificationByUserIdAndThemeId);

router.delete('/:userId/:themeId', secure.checkAdminRole, certificationController.deleteCertification);

router.patch('/:userId/:themeId', secure.checkAdminRole, certificationController.updateCertification);

module.exports = router;
