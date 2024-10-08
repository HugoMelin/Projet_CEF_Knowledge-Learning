const Certification = require('../models/Certification');

/**
 * Creates a new certification.
 * @async
 * @function createCertification
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createCertification = async (req, res) => {
  try {
    const certificationData = req.body;
    // Validate required fields
    if (!certificationData.idUser || !certificationData.idThemes) {
      return res.status(400).json({ message: 'Veuillez fournir l\'ID de l\'utilisateur et l\'ID du thème' });
    }

    // Check for existing certification
    const existingCertification = await Certification
      .findByUserAndThemeId(certificationData.idUser, certificationData.idThemes);
    if (existingCertification) {
      console.error('Cet utilisateur possède déjà cette certification');
      return res.status(500).json({ message: 'Cet utilisateur possède déjà cette certification' });
    }

    // Create new certification
    const newCertification = await Certification.create(certificationData);
    res.status(201).json({ message: 'Certification enregistrée avec succès.', certification: newCertification });
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement de la certification: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all certifications.
 * @async
 * @function getAllCertifications
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll();
    if (certifications.length === 0) {
      return res.status(404).json({ message: 'Aucune certification n\'a été trouvée' });
    }
    res.status(200).json(certifications);
  } catch (error) {
    console.error(`Erreur lors de la récupération des certifications: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves certifications by user ID.
 * @async
 * @function getCertificationsByUserId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getCertificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const certifications = await Certification.findByUserId(userId);
    if (certifications.length === 0) {
      return res.status(404).json({ message: 'Aucune certification trouvée pour cet utilisateur' });
    }
    res.status(200).json(certifications);
  } catch (error) {
    console.error(`Erreur lors de la récupération des certifications: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a certification by user ID and theme ID.
 * @async
 * @function getCertificationByUserIdAndThemeId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getCertificationByUserIdAndThemeId = async (req, res) => {
  try {
    const { userId, themeId } = req.params;
    const certification = await Certification.findByUserAndThemeId(userId, themeId);
    if (!certification) {
      console.error('Cet utilisateur ne possède pas cette certification');
      return res.status(404).json({ message: 'Cet utilisateur ne possède pas cette certification' });
    }
    res.status(200).json(certification);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la certification: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a certification.
 * @async
 * @function deleteCertification
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deleteCertification = async (req, res) => {
  try {
    const { userId, themeId } = req.params;
    const certificationToDelete = await Certification.findByUserAndThemeId(userId, themeId);
    if (certificationToDelete) {
      await Certification.delete(certificationToDelete);
      res.status(200).json({ message: 'Certification supprimée avec succès', certificationDeleted: certificationToDelete });
    } else {
      console.error('Aucune certification trouvée pour cet utilisateur et ce thème');
      res.status(404).json({ message: 'Aucune certification trouvée pour cet utilisateur et ce thème' });
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de la certification: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a certification.
 * @async
 * @function updateCertification
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateCertification = async (req, res) => {
  try {
    const { userId, themeId } = req.params;
    const certificationData = req.body;

    // Check if obtainedDate is provided
    if (certificationData.obtainedDate) {
      const certificationToUpdate = await Certification.findByUserAndThemeId(userId, themeId);
      if (certificationToUpdate) {
        await Certification.update(certificationToUpdate, certificationData);
        const updatedCertification = await Certification.findByUserAndThemeId(userId, themeId);
        res.status(200).json({ message: 'Certification mise à jour avec succès', certificationUpdated: updatedCertification });
      } else {
        console.error('Aucune certification trouvée pour cet utilisateur et ce thème');
        res.status(404).json({ message: 'Aucune certification trouvée pour cet utilisateur et ce thème' });
      }
    } else {
      console.error('Vous devez fournir une nouvelle date d\'obtention');
      res.status(400).json({ message: 'Vous devez fournir une nouvelle date d\'obtention' });
    }
  } catch (error) {
    console.error(`Erreur lors de la modification de la certification: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
