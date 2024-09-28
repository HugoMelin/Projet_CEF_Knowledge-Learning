const express = require('express');
const usersRoute = require('./users');
const themesRoute = require('./themes');
const courseRoute = require('./courses');
const lessonRouter = require('./lessons');
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

router.use('/verify', verifyRouter);

module.exports = router;
