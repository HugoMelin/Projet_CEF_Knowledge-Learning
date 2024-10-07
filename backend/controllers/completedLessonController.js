const CompletedLesson = require('../models/completedLesson');
const CompletionService = require('../services/completionService');

/**
 * Creates a new completed lesson record.
 * @async
 * @function createCompletedLesson
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createCompletedLesson = async (req, res) => {
  try {
    const lessonData = req.body;
    // Validate required fields
    if (!lessonData.idUser || !lessonData.idLessons) {
      return res.status(400).json({ message: 'Veuillez fournir l\'ID de l\'utilisateur et l\'ID du cours' });
    }

    // Check for existing completed lesson
    const existingCompletedLesson = await CompletedLesson
      .findByUserAndLessonsId(lessonData.idUser, lessonData.idLessons);
    if (existingCompletedLesson) {
      console.error('Cet utilisateur à déjà validé cette lesson');
      return res.status(500).json({ message: 'Cet utilisateur à déjà validé cette lesson' });
    }

    // Create new completed lesson record using CompletionService
    const newCompletedLesson = await CompletionService
      .handleLessonCompletion(lessonData.idUser, lessonData.idLessons);
    res.status(201).json({ message: 'Leçon complétée enregistrée avec succès.', completedLesson: newCompletedLesson });
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement de la leçon complétée: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all completed lessons.
 * @async
 * @function getAllCompletedLessons
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllCompletedLessons = async (req, res) => {
  try {
    const completedLessons = await CompletedLesson.findAll();
    if (completedLessons.length === 0) {
      console.error('Aucune leçon complétée n\'a été trouvée');
      return res.status(404).json({ message: 'Aucune leçon complétée n\'a été trouvée' });
    }
    res.status(200).json(completedLessons);
  } catch (error) {
    console.error(`Erreur lors de la récupération des leçons complétées: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves completed lessons by user ID.
 * @async
 * @function getCompletedLessonsByUserId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getCompletedLessonsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const completedLessons = await CompletedLesson.findByUserId(userId);
    if (completedLessons.length === 0) {
      console.error('Aucune leçon complétée trouvée pour cet utilisateur');
      return res.status(404).json({ message: 'Aucune leçon complétée trouvée pour cet utilisateur' });
    }
    res.status(200).json(completedLessons);
  } catch (error) {
    console.error(`Erreur lors de la récupération des leçons complétées: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a completed lesson by user ID and lesson ID.
 * @async
 * @function getCompletedLessonsByUserIdAndLessonsId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getCompletedLessonsByUserIdAndLessonsId = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const completedLessons = await CompletedLesson.findByUserAndLessonsId(userId, lessonId);
    if (!completedLessons) {
      console.error('Cet utilisateur n\'a pas complété cette leçon');
      return res.status(404).json({ message: 'Cet utilisateur n\'a pas complété cette leçon' });
    }
    res.status(200).json(completedLessons);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la leçon complétée: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a completed lesson record.
 * @async
 * @function deleteCompletedLesson
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deleteCompletedLesson = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const lessonToDelete = await CompletedLesson.findByUserAndLessonsId(userId, lessonId);
    if (lessonToDelete) {
      await CompletedLesson.delete(lessonToDelete);
      res.status(200).json({ message: 'Leçon complétée supprimée avec succès', lessonDeleted: lessonToDelete });
    } else {
      console.error('Aucune leçon complétée trouvée pour cet utilisateur et ce cours');
      res.status(404).json({ message: 'Aucune leçon complétée à supprimer' });
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de la leçon complétée: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a completed lesson record.
 * @async
 * @function updateCompletedLesson
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateCompletedLesson = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const lessonData = req.body;

    // Check if completedDate is provided
    if (lessonData.completedDate) {
      const completedLessonToUpdate = await CompletedLesson
        .findByUserAndLessonsId(userId, lessonId);
      if (completedLessonToUpdate) {
        await CompletedLesson.update(completedLessonToUpdate, lessonData);
        const updatedCompletedLesson = await CompletedLesson
          .findByUserAndLessonsId(userId, lessonId);
        res.status(200).json({ message: 'Leçon complétée mise à jour avec succès', lessonUpdated: updatedCompletedLesson });
      } else {
        console.error('Aucune leçon complétée trouvée pour cet utilisateur et ce cours');
        res.status(404).json({ message: 'Aucune leçon complétée trouvée pour cet utilisateur et ce cours' });
      }
    } else {
      console.error('Vous devez fournir une nouvelle date de complétion');
      res.status(400).json({ message: 'Vous devez fournir une nouvelle date de complétion' });
    }
  } catch (error) {
    console.error(`Erreur lors de la modification de la leçon complétée: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
