const express = require('express');

const router = express.Router();

const courseController = require('../controllers/courseController');
const secure = require('../middleware/secure');

router.post('/', secure.checkAdminRole, courseController.createCourse);

router.get('/', courseController.getAllCourses);

router.get('/:id', courseController.getOneCourseById);

router.delete('/:id', secure.checkAdminRole, courseController.deleteCourse);

router.patch('/:id', secure.checkAdminRole, courseController.updateCourse);

module.exports = router;
