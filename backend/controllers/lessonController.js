const Lesson = require('../models/Lesson');

exports.createLesson = async (req, res) => {
  try {
    const lessonData = req.body;
    if (!lessonData.title || !lessonData.content || !lessonData.videoUrl || !lessonData.idCourses) {
      return res.status(400).json({ message: 'Veuillez fournir un titre, un contenu et un ID de cours pour la leçon' });
    }

    const existingLesson = await Lesson.findByTitle(lessonData.title);
    if (existingLesson) {
      console.error('Une leçon possède déjà ce titre');
      return res.status(409).json({ message: 'Une leçon possède déjà ce titre' });
    }

    const newLesson = await Lesson.create(lessonData);
    res.status(201).json({ message: 'Leçon créée avec succès.', leçon: newLesson });
  } catch (error) {
    console.error(`Erreur lors de la création de la leçon: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

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

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lessonData = req.body;

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
