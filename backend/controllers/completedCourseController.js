const CompletedCourse = require('../models/CompletedCourse');

/**
 * Creates a new completed course record.
 * @async
 * @function createCompletedCourse
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createCompletedCourse = async (req, res) => {
  try {
    const courseData = req.body;
    // Validate required fields
    if (!courseData.idUser || !courseData.idCourses) {
      return res.status(400).json({ message: 'Veuillez fournir l\'ID de l\'utilisateur et l\'ID du cours' });
    }

    // Check for existing completed course
    const existingCompletedCourse = await CompletedCourse
      .findByUserAndCoursesId(courseData.idUser, courseData.idCourses);
    if (existingCompletedCourse) {
      console.error('Cet utilisateur à déjà validé ce cours');
      return res.status(500).json({ message: 'Cet utilisateur à déjà validé ce cours' });
    }

    // Create new completed course record
    const newCompletedCourse = await CompletedCourse.create(courseData);
    res.status(201).json({ message: 'Cours complété enregistré avec succès.', completedCourse: newCompletedCourse });
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement du cours complété: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all completed courses.
 * @async
 * @function getAllCompletedCourses
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllCompletedCourses = async (req, res) => {
  try {
    const completedCourses = await CompletedCourse.findAll();
    if (completedCourses.length === 0) {
      return res.status(404).json({ message: 'Aucun cours complété n\'a été trouvé' });
    }
    res.status(200).json(completedCourses);
  } catch (error) {
    console.error(`Erreur lors de la récupération des cours complétés: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves completed courses by user ID.
 * @async
 * @function getCompletedCoursesByUserId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getCompletedCoursesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const completedCourses = await CompletedCourse.findByUserId(userId);
    if (completedCourses.length === 0) {
      return res.status(404).json({ message: 'Aucun cours complété trouvé pour cet utilisateur' });
    }
    res.status(200).json(completedCourses);
  } catch (error) {
    console.error(`Erreur lors de la récupération des cours complétés: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a completed course by user ID and course ID.
 * @async
 * @function getCompletedCoursesByUserIdAndCoursesId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getCompletedCoursesByUserIdAndCoursesId = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const completedCourses = await CompletedCourse.findByUserAndCoursesId(userId, courseId);
    if (!completedCourses) {
      console.error('Cet utilisateur n\'a pas complété ce cours');
      return res.status(404).json({ message: 'Cet utilisateur n\'a pas complété ce cours' });
    }
    res.status(200).json(completedCourses);
  } catch (error) {
    console.error(`Erreur lors de la récupération du cours complété: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a completed course record.
 * @async
 * @function deleteCompletedCourse
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deleteCompletedCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const courseToDelete = await CompletedCourse.findByUserAndCoursesId(userId, courseId);
    if (courseToDelete) {
      await CompletedCourse.delete(courseToDelete);
      res.status(200).json({ message: 'Cours complété supprimé avec succès', courseDeleted: courseToDelete });
    } else {
      console.error('Aucun cours complété trouvé pour cet utilisateur et ce cours');
      res.status(404).json({ message: 'Aucun cours complété trouvé pour cet utilisateur et ce cours' });
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du cours complété: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a completed course record.
 * @async
 * @function updateCompletedCourse
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateCompletedCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const courseData = req.body;

    // Check if completedDate is provided
    if (courseData.completedDate) {
      const completedCourseToUpdate = await CompletedCourse
        .findByUserAndCoursesId(userId, courseId);
      if (completedCourseToUpdate) {
        await CompletedCourse.update(completedCourseToUpdate, courseData);
        const updatedCompletedCourse = await CompletedCourse
          .findByUserAndCoursesId(userId, courseId);
        res.status(200).json({ message: 'Cours complété mis à jour avec succès', courseUpdated: updatedCompletedCourse });
      } else {
        console.error('Aucun cours complété trouvé pour cet utilisateur et ce cours');
        res.status(404).json({ message: 'Aucun cours complété trouvé pour cet utilisateur et ce cours' });
      }
    } else {
      console.error('Vous devez fournir une nouvelle date de complétion');
      res.status(400).json({ message: 'Vous devez fournir une nouvelle date de complétion' });
    }
  } catch (error) {
    console.error(`Erreur lors de la modification du cours complété: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
