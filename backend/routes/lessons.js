const express = require('express');

const router = express.Router();

const lessonController = require('../controllers/lessonController');
const secure = require('../middleware/secure');

router.post('/', secure.checkAdminRole, lessonController.createLesson);

router.get('/', secure.checkJWT, lessonController.getAllLessons);

router.get('/:id', secure.checkCourseAccess, lessonController.getOneLessonById);

router.get('/course/:idCourse', secure.checkJWT, lessonController.getLessonsByCourseId);

router.delete('/:id', secure.checkAdminRole, lessonController.deleteLesson);

router.patch('/:id', secure.checkAdminRole, lessonController.updateLesson);

module.exports = router;
