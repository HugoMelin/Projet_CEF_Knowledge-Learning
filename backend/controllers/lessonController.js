const Lesson = require('../models/Lesson');

/**
 * Creates a new lesson.
 * @async
 * @function createLesson
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createLesson = async (req, res) => {
  try {
    const lessonData = req.body;
    // Validate required fields
    if (!lessonData.title || !lessonData.content || !lessonData.videoUrl || !lessonData.idCourses) {
      return res.status(400).json({ message: 'Veuillez fournir un titre, un contenu et un ID de cours pour la leçon' });
    }

    // Check for existing lesson with the same title
    const existingLesson = await Lesson.findByTitle(lessonData.title);
    if (existingLesson) {
      console.error('Une leçon possède déjà ce titre');
      return res.status(409).json({ message: 'Une leçon possède déjà ce titre' });
    }

    // Create new lesson
    const newLesson = await Lesson.create(lessonData);
    res.status(201).json({ message: 'Leçon créée avec succès.', leçon: newLesson });
  } catch (error) {
    console.error(`Erreur lors de la création de la leçon: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all lessons.
 * @async
 * @function getAllLessons
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll();
    if (lessons.length === 0) {
      console.error('Aucune leçon n\'a été trouvée');
      return res.status(404).json({ message: 'Aucune leçon n\'a été trouvée' });
    }
    res.status(200).json(lessons);
  } catch (error) {
    console.error(`Erreur lors de la récupération des leçons: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a single lesson by its ID.
 * @async
 * @function getOneLessonById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getOneLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      console.error('Aucune leçon trouvée pour cet ID');
      return res.status(404).json({ message: 'Aucune leçon trouvée' });
    }
    res.status(200).json(lesson);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la leçon: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all lessons for a specific course.
 * @async
 * @function getLessonsByCourseId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getLessonsByCourseId = async (req, res) => {
  try {
    const { idCourse } = req.params;
    
    // Validate that idCourse is a number
    if (isNaN(idCourse)) {
      return res.status(400).json({ message: 'L\'ID du cours doit être un nombre' });
    }

    const lessons = await Lesson.findByCourseId(parseInt(idCourse, 10));
    
    if (lessons.length === 0) {
      console.log(`Aucune leçon trouvée pour le cours avec l'ID ${idCourse}`);
      return res.status(404).json({ message: 'Aucune leçon trouvée pour ce cours' });
    }
    
    res.status(200).json(lessons);
  } catch (error) {
    console.error(`Erreur lors de la récupération des leçons pour le cours: ${error}`);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des leçons' });
  }
};

/**
 * Deletes a lesson by its ID.
 * @async
 * @function deleteLesson
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lessonToDelete = await Lesson.findById(id);
    if (lessonToDelete) {
      await Lesson.delete(lessonToDelete);
      res.status(200).json({ message: 'Leçon supprimée avec succès', lessonDeleted: lessonToDelete });
    } else {
      console.error('Aucune leçon trouvée pour cet ID');
      res.status(404).json({ message: 'Aucune leçon à supprimer' });
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de la leçon: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a lesson by its ID.
 * @async
 * @function updateLesson
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lessonData = req.body;

    // Check if update data is provided
    if (Object.keys(lessonData).length === 0) {
      console.error('Aucune donnée fournie pour la mise à jour');
      return res.status(400).json({ message: 'Aucune donnée fournie pour la mise à jour' });
    }

    const lessonToUpdate = await Lesson.findById(id);
    if (lessonToUpdate) {
      await Lesson.update(lessonToUpdate, lessonData);
      const updatedLesson = await Lesson.findById(id);
      res.status(200).json({ message: 'Leçon mise à jour avec succès', lessonUpdated: updatedLesson });
    } else {
      console.error('Aucune leçon trouvée pour cet ID');
      res.status(404).json({ message: 'Aucune leçon trouvée pour cet ID' });
    }
  } catch (error) {
    console.error(`Erreur lors de la modification de la leçon: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
