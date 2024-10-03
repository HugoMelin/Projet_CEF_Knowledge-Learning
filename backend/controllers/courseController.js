const Course = require('../models/Course');

/**
 * Creates a new course.
 * @async
 * @function createCourse
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    // Validate required fields
    if (!courseData.title || !courseData.description || !courseData.price || !courseData.idThemes) {
      return res.status(400).json({ message: 'Veuillez fournir toutes les informations nécessaires pour le cours' });
    }

    // Check for existing course with the same title
    const existingCourse = await Course.findByName(courseData.title);
    if (existingCourse) {
      console.error('Un cours avec ce titre existe déjà');
      return res.status(400).json({ message: 'Un cours avec ce titre existe déjà' });
    }

    // Create new course
    const newCourse = await Course.create(courseData);
    res.status(201).json({ message: 'Cours créé avec succès.', cours: newCourse });
  } catch (error) {
    console.error(`Erreur lors de la création du cours: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all courses.
 * @async
 * @function getAllCourses
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    if (courses.length === 0) {
      console.error('Aucun cours n\'a été trouvé');
      return res.status(404).json({ message: 'Aucun cours n\'a été trouvé' });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error(`Erreur lors de la récupération des cours: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a single course by its ID.
 * @async
 * @function getOneCourseById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getOneCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      console.error('Aucun cours trouvé pour cet ID');
      return res.status(404).json({ message: 'Aucun cours trouvé' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(`Erreur lors de la récupération du cours: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a course by its ID.
 * @async
 * @function deleteCourse
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseToDelete = await Course.findById(id);
    if (courseToDelete) {
      await Course.delete(courseToDelete);
      res.status(200).json({ message: 'Cours supprimé avec succès', courseDeleted: courseToDelete });
    } else {
      console.error('Aucun cours trouvé pour cet ID');
      res.status(404).json({ message: 'Aucun cours à supprimer' });
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du cours: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a course by its ID.
 * @async
 * @function updateCourse
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    // Check if update data is provided
    if (Object.keys(courseData).length === 0) {
      console.error('Aucune donnée fournie pour la mise à jour');
      return res.status(400).json({ message: 'Aucune donnée fournie pour la mise à jour' });
    }

    const courseToUpdate = await Course.findById(id);
    if (courseToUpdate) {
      await Course.update(courseToUpdate, courseData);
      const updatedCourse = await Course.findById(id);
      res.status(200).json({ message: 'Cours mis à jour avec succès', courseUpdated: updatedCourse });
    } else {
      console.error('Aucun cours trouvé pour cet ID');
      res.status(404).json({ message: 'Aucun cours trouvé pour cet ID' });
    }
  } catch (error) {
    console.error(`Erreur lors de la modification du cours: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
