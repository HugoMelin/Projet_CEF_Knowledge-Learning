const jwt = require('jsonwebtoken');
const Lesson = require('../models/Lesson');
const Purchase = require('../models/Purchase');

const { SECRET_KEY } = process.env;

/**
 * Creates an authentication middleware.
 * @function
 * @param {Function} verificationFn - Function to verify user permissions.
 * @returns {Function} Express middleware function.
 */
const checkAuth = (verificationFn) => async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  if (!token) {
    console.error('Authentification requise');
    return res.status(401).json({ message: 'Authentification requise' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;

    if (!verificationFn(req.user)) {
      console.error('Accès refusé');
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Token renewal
    const expiresIn = 24 * 60 * 60;
    const newToken = jwt.sign(
      { user: req.user },
      SECRET_KEY,
      { expiresIn },
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      maxAge: expiresIn * 1000,
    });

    res.header('Authorization', `Bearer ${newToken}`);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expiré');
      return res.status(401).json({ message: 'Token expiré' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('Token invalide');
      return res.status(401).json({ message: 'Token invalide' });
    }
    console.error('Erreur interne du serveur');
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Middleware to check if JWT is valid.
 * @type {Function}
 */
exports.checkJWT = checkAuth((user) => user);

/**
 * Middleware to check if user has admin role.
 * @type {Function}
 */
exports.checkAdminRole = checkAuth((user) => user.role.includes('role-admin'));

/**
 * Middleware to check if user has user role.
 * @type {Function}
 */
exports.checkUserRole = checkAuth((user) => user.role.includes('role-user'));

/**
 * Middleware to check if user is verified.
 * @type {Function}
 */
exports.checkIfVerify = checkAuth((user) => user.isVerified === 1);

/**
 * Middleware to check course access.
 * @async
 * @function checkCourseAccess
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
exports.checkCourseAccess = async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  if (!token) {
    console.error('Authentification requise');
    return res.status(401).json({ message: 'Authentification requise' });
  }

  const { id } = req.params;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;

    const findLesson = await Lesson.findById(id);
    const courseId = findLesson.idCourses;

    const hasPurchased = await Purchase.findByUserAndCourseId(req.user.idUser, courseId);
    if (!hasPurchased) {
      const hasLessonAccess = await Purchase
        .findByUserAndLessonId(req.user.idUser, findLesson.idLessons);
      console.log(req.user.idUser);
      if (!hasLessonAccess) {
        return res.status(403).json({ message: "Accès refusé. Vous n'avez pas acheté ce contenu" });
      }
    }

    // Token renewal
    const expiresIn = 24 * 60 * 60;
    const newToken = jwt.sign(
      { user: req.user },
      SECRET_KEY,
      { expiresIn },
    );

    res.cookie('token', newToken, {
      httpOnly: true,
      maxAge: expiresIn * 1000,
    });

    res.header('Authorization', `Bearer ${newToken}`);

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expiré');
      return res.status(401).json({ message: 'Token expiré' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('Token invalide');
      return res.status(401).json({ message: 'Token invalide' });
    }
    console.error('Erreur interne du serveur');
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
