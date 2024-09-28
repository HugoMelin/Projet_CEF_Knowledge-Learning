const express = require('express');

const router = express.Router();

const lessonController = require('../controllers/lessonController');
// const secure = require('../middleware/secure');

router.post('/', lessonController.createLesson);

router.get('/', lessonController.getAllLessons);

router.get('/:id', lessonController.getOneLessonById);

router.delete('/:id', lessonController.deleteLesson);

router.patch('/:id', lessonController.updateLesson);

module.exports = router;
