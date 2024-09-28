const express = require('express');

const router = express.Router();

const courseController = require('../controllers/courseController');
// const secure = require('../middleware/secure');

router.post('/', courseController.createCourse);

router.get('/', courseController.getAllCourses);

router.get('/:id', courseController.getOneCourseById);

router.delete('/:id', courseController.deleteCourse);

router.patch('/:id', courseController.updateCourse);

module.exports = router;
