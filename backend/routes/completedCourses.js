const express = require('express');

const router = express.Router();

const completedCourseController = require('../controllers/completedCourseController');
const secure = require('../middleware/secure');

router.post('/', secure.checkUserRole, completedCourseController.createCompletedCourse);

router.get('/', secure.checkAdminRole, completedCourseController.getAllCompletedCourses);

router.get('/:userId', secure.checkUserRole, completedCourseController.getCompletedCoursesByUserId);

router.get('/:userId/:courseId', secure.checkUserRole, completedCourseController.getCompletedCoursesByUserIdAndCoursesId);

router.delete('/:userId/:courseId', secure.checkAdminRole, completedCourseController.deleteCompletedCourse);

router.patch('/:userId/:courseId', secure.checkAdminRole, completedCourseController.updateCompletedCourse);

module.exports = router;
