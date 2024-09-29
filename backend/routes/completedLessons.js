const express = require('express');

const router = express.Router();

const completedLessonController = require('../controllers/completedLessonController');
// const secure = require('../middleware/secure');

router.post('/', completedLessonController.createCompletedLesson);

router.get('/', completedLessonController.getAllCompletedLessons);

router.get('/:userId', completedLessonController.getCompletedLessonsByUserId);

router.get('/:userId/:lessonId', completedLessonController.getCompletedLessonsByUserIdAndLessonsId);

router.delete('/:userId/:lessonId', completedLessonController.deleteCompletedLesson);

router.patch('/:userId/:lessonId', completedLessonController.updateCompletedLesson);

module.exports = router;
