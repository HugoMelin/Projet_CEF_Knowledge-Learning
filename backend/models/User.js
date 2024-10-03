const db = require('../database/database');

/**
 * Represents a User.
 * @class
 */
class User {
  /**
   * Create a User.
   * @param {string} username - The user's username.
   * @param {string} email - The user's email.
   * @param {string} password - The user's hashed password.
   * @param {string|null} [verificationToken=null] - The user's verification token.
   * @param {string} [role="['role-user']"] - The user's role.
   * @param {number} [isVerified=0] - Whether the user is verified.
   * @param {number|null} [idUser=null] - The user's ID.
   */
  constructor(username, email, password, verificationToken = null, role = "['role-user']", isVerified = 0, idUser = null) {
    this.idUser = idUser;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isVerified = isVerified;
    this.verificationToken = verificationToken;
  }

  /**
   * Create a new user.
   * @async
   * @param {Object} userData - The user data.
   * @returns {Promise<User>} The created user.
   * @throws {Error} If the user already exists or if there's an error during creation.
   */
  static async create(userData) {
    try {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
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

  /**
   * Find all users.
   * @async
   * @returns {Promise<User[]>} Array of all users.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users');
      return rows.map((row) => new User(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les utilisateurs: ${error}`);
      throw error;
    }
  }

  /**
   * Find a user by ID.
   * @async
   * @param {number} id - The user ID.
   * @returns {Promise<User|null>} The found user or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users WHERE id_user = ?', [id]);
      return rows.length > 0 ? new User(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'utilisateur par ID: ${error}`);
      throw error;
    }
  }

  /**
   * Find a user by email.
   * @async
   * @param {string} email - The user's email.
   * @returns {Promise<User|null>} The found user or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users WHERE email = ?', [email]);
      return rows.length > 0 ? new User(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'utilisateur par email: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a user.
   * @async
   * @param {Object} userData - The user data to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no user was deleted or if there's an error during deletion.
   */
  static async delete(userData) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM users 
        WHERE id_user = ?
      `, [userData.idUser]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun utilisateur n\'a été supprimé');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Update a user.
   * @async
   * @param {User} user - The user to update.
   * @param {Object} dataToUpdate - The data to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no user was updated or if there's an error during update.
   */
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
        throw new Error('Aucun utilisateur n\'a été mis à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Verify a user's account.
   * @async
   * @param {string} token - The verification token.
   * @returns {Promise<Object>} The verification result.
   * @throws {Error} If the token is invalid or if there's an error during verification.
   */
  static async verifyUser(token) {
    try {
      const [users] = await db.query(`
          SELECT id_user
          FROM users
          WHERE verification_token = ?
          AND is_verified = false
        `, [token]);

      if (users.length === 0) {
        throw new Error('Token de vérification invalide ou déjà utilisé');
      }

      const userId = users[0].id_user;

      const [response] = await db.query(`
          UPDATE users
          SET is_verified = true,
          verification_token = NULL
          WHERE id_user = ?
        `, [userId]);

      if (response.affectedRows === 0) {
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
