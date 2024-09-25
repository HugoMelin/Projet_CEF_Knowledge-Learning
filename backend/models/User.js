/* eslint-disable no-console */
const db = require('../database/database');

class User {
  constructor(username, email, password, verificationToken = null, role = "['role-user']", isVerified = 0, idUser = null) {
    this.idUser = idUser;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isVerified = isVerified;
    this.verificationToken = verificationToken;
  }

  static async create(userData) {
    try {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        console.error('Un utilisateur avec cet email existe déjà !');
        throw new Error('Un utilisateur avec cet email existe déjà !');
      }
      const newUser = new User(...Object.values(userData));
      const [response] = await db.query(`
        INSERT 
        INTO users (username, email, password, role, is_verified, verification_token)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [newUser.username, newUser.email, newUser.password, newUser.role, newUser.isVerified, newUser.verificationToken]);
      newUser.idUser = response.insertId;
      return newUser;
    } catch (error) {
      console.error(`Erreur lors de la création de l'utilisateur: ${error}`);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users');
      const result = rows.map((row) => new User(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les utilisateurs: ${error}`);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users WHERE id_user = ?', [id]);
      const result = rows.map((row) => new User(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'utilisateur par ID: ${error}`);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users WHERE email = ?', [email]);
      const result = rows.map((row) => new User(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'utilisateur par email: ${error}`);
      throw error;
    }
  }

  static async delete(userData) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM users 
        WHERE id_user = ?
      `, [userData.idUser]);

      if (response.affectedRows === 0) {
        console.error('Aucun utilisateur n\'a été supprimé');
        throw new Error('Aucun utilisateur n\'a été supprimé');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur: ${error}`);
      throw error;
    }
  }

  static async update(user, dataToUpdate) {
    try {
      const {
        username,
        email,
        password,
        role,
        isVerified,
      } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE users 
        SET 
          username = COALESCE(?, username),
          email = COALESCE(?, email),
          password = COALESCE(?, password),
          role = COALESCE(?, role),
          is_verified = COALESCE(?, is_verified)
        WHERE id_user = ?;
        `, [username, email, password, role, isVerified, user.idUser]);

      if (response.affectedRows === 0) {
        console.error('Aucun utilisateur n\'a été mis à jour');
        throw new Error('Aucun utilisateur n\'a été mis à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur: ${error}`);
      throw error;
    }
  }

  static async verifyUser(token) {
    try {
      // Étape 1 : On recherche l'utilisateur avec le token de vérification
      const [users] = await db.query(`
          SELECT id_user
          FROM users
          WHERE verification_token = ?
          AND is_verified = false
        `, [token]);

      if (users.length === 0) {
        console.error('Token de vérification invalide ou déjà utilisé');
        throw new Error('Token de vérification invalide ou déjà utilisé');
      }

      const userId = users[0].id_user;

      // Étape 2 : On marque l'utilisateur comme vérifié
      const [response] = await db.query(`
          UPDATE users
          SET is_verified = true,
          verification_token = NULL
          WHERE id_user = ?
        `, [userId]);

      if (response.affectedRows === 0) {
        console.error('Échec de la vérification du compte');
        throw new Error('Échec de la vérification du compte');
      }

      return { message: 'Compte vérifié avec succès' };
    } catch (error) {
      console.error(`Erreur lors de la vérification de l'utilisateur: ${error}`);
      throw error;
    }
  }
}

module.exports = User;
