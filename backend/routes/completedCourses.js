const express = require('express');

const router = express.Router();

const completedCourseController = require('../controllers/completedCourseController');
// const secure = require('../middleware/secure');

router.post('/', completedCourseController.createCompletedCourse);

router.get('/', completedCourseController.getAllCompletedCourses);

router.get('/:userId', completedCourseController.getCompletedCoursesByUserId);

router.get('/:userId/:courseId', completedCourseController.getCompletedCoursesByUserIdAndCoursesId);

router.delete('/:userId/:courseId', completedCourseController.deleteCompletedCourse);

router.patch('/:userId/:courseId', completedCourseController.updateCompletedCourse);

module.exports = router;
