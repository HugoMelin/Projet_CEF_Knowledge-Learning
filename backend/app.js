const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const csrf = require('csurf');

const indexRouter = require('./routes/index');

const app = express();

// const csrfProtection = csrf({ cookie: true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_PARSER_KEY, {
  sameSite: 'strict',
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

module.exports = app;
