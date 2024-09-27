const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { sendVerificationEmail } = require('../services/emailsService');

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.email || !userData.password || !userData.username) {
      return res.status(400).json({ message: 'Email, mot de passe et nom d\'utilisateur sont requis' });
    }

    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      console.error('Un utilisateur avec cet email existe déjà !');
      return res.status(404).json({ message: 'Un utilisateur avec cet email existe déjà !' });
    }
    userData.password = await bcrypt.hash(userData.password, 10);
    userData.verificationToken = await sendVerificationEmail(userData.email);
    const newUser = await User.create(userData);
    res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
  } catch (error) {
    console.error(`Erreur lors de la création de l'utilisateur: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      console.error('Aucun utilisateur n\'a été trouvé');
      res.status(404).json({ message: 'Aucun utilisateur n\'a été trouvé' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(`Erreur lors de la récupération des utilisateurs: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.getOneUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      console.error('Aucun utilisateur trouvé pour cette Id');
      res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

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
        {
          user,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: expireIn,
        },
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: expireIn * 1000,
      });

      res.header('Authorization', `Bearer ${token}`);

      return res.status(200).json('Authentification réussi');
    }
    return res.status(403).json('Mauvaise adresse mail');
  } catch (error) {
    return res.status(500).json(error);
  }
};
