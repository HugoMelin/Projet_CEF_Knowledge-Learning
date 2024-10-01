const express = require('express');
const usersRoute = require('./users');
const themesRoute = require('./themes');
const courseRoute = require('./courses');
const lessonRouter = require('./lessons');
const completedLessonRouter = require('./completedLessons');
const completedCourseRouter = require('./completedCourses');
const certificationRouter = require('./certifications');
const payementRouter = require('./payements');
const invoiceRouter = require('./invoices');
const verifyRouter = require('./verify');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.send('Test Api');
});

router.use('/users', usersRoute);

router.use('/themes', themesRoute);

router.use('/courses', courseRoute);

router.use('/lessons', lessonRouter);

router.use('/completed_lessons', completedLessonRouter);

router.use('/completed_courses', completedCourseRouter);

router.use('/certifications', certificationRouter);

router.use('/create-checkout-session', payementRouter);

router.use('/invoices', invoiceRouter);

router.use('/verify', verifyRouter);

module.exports = router;
