const express = require('express');

const router = express.Router();

const completedLessonController = require('../controllers/completedLessonController');
const secure = require('../middleware/secure');

router.post('/', secure.checkUserRole, completedLessonController.createCompletedLesson);

router.get('/', secure.checkAdminRole, completedLessonController.getAllCompletedLessons);

router.get('/:userId', secure.checkUserRole, completedLessonController.getCompletedLessonsByUserId);

router.get('/:userId/:lessonId', secure.checkUserRole, completedLessonController.getCompletedLessonsByUserIdAndLessonsId);

router.delete('/:userId/:lessonId', secure.checkAdminRole, completedLessonController.deleteCompletedLesson);

router.patch('/:userId/:lessonId', secure.checkAdminRole, completedLessonController.updateCompletedLesson);

module.exports = router;
