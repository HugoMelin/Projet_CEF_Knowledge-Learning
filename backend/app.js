const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const csrf = require('csurf');

const indexRouter = require('./routes/index');

const app = express();

// const csrfProtection = csrf({ cookie: true });

app.use(cors({
  origin: 'http://localhost:4200', // L'URL de votre application Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_PARSER_KEY, {
  sameSite: 'strict',
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(`${__dirname}/docs`)));

app.use('/api', indexRouter);

module.exports = app;
