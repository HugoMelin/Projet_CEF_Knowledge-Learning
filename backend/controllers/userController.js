const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordValidator = require('password-validator');
const { sendVerificationEmail } = require('../services/emailsService');

const validatePassword = (password) => {
  const schema = new PasswordValidator();

  schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

  return schema.validate(password);
};

/**
 * Creates a new user.
 * @async
 * @function createUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    // Validate required fields
    if (!userData.email || !userData.password || !userData.username) {
      return res.status(400).json({ message: 'Email, mot de passe et nom d\'utilisateur sont requis' });
    }

    if (!validatePassword(userData.password)) {
      return res.status(400).json({ error: 'Le mot de passe ne respecte pas les critères de sécurité' });
    }

    // Check for existing user
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      console.error('Un utilisateur avec cet email existe déjà !');
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà !' });
    }

    // Hash password and create verification token
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.verificationToken = await sendVerificationEmail(userData.email);

    // Create new user
    const newUser = await User.create(userData);
    res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (error) {
    console.error(`Erreur lors de la création de l'utilisateur: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all users.
 * @async
 * @function getAllUsers
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      console.error('Aucun utilisateur n\'a été trouvé');
      return res.status(404).json({ message: 'Aucun utilisateur n\'a été trouvé' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(`Erreur lors de la récupération des utilisateurs: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a single user by ID.
 * @async
 * @function getOneUserById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getOneUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      console.error('Aucun utilisateur trouvé pour cette Id');
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a user by ID.
 * @async
 * @function deleteUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await User.findById(id);
    if (userToDelete) {
      await User.delete(userToDelete);
      res.status(200).json({ message: 'User successfully delete', userDeleted: userToDelete });
    } else {
      console.error('Aucun utilisateur trouvé pour cette Id');
      res.status(404).json({ message: 'Aucun utilisateur à supprimer' });
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a user by ID.
 * @async
 * @function updateUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    if (!validatePassword(userData.password)) {
      return res.status(400).json({ error: 'Le mot de passe ne respecte pas les critères de sécurité' });
    }

    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const userToUpdate = await User.findById(id);
    if (userToUpdate) {
      await User.update(userToUpdate, userData);
      const updatedUser = await User.findById(id);
      res.status(200).json({ message: 'User successfully updated', userUpdated: updatedUser });
    } else {
      console.error('Aucun utilisateur trouvé pour cette Id');
      res.status(404).json({ message: 'No user found' });
    }
  } catch (error) {
    console.error(`Erreur lors de la modification de l'utilisateur: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verifies a user's email.
 * @async
 * @function verifyUser
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await User.verifyUser(token);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Token de vérification invalide ou déjà utilisé') {
      return res.status(400).send(error.message);
    }
    console.error(`Erreur lors de la vérification de l'utilisateur: ${error}`);
    return res.status(500).send(error.message);
  }
};

/**
 * Authenticates a user.
 * @async
 * @function authenticate
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(403).json('Mot de passe incorrect');
      }

      const expireIn = 24 * 60 * 60;
      const token = jwt.sign(
        { user },
        process.env.SECRET_KEY,
        { expiresIn: expireIn },
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: expireIn * 1000,
      });

      res.header('Authorization', `Bearer ${token}`);

      return res.status(200).json(token);
    }
    return res.status(403).json('Mauvaise adresse mail');
  } catch (error) {
    return res.status(500).json(error);
  }
};
