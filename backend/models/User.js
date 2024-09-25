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
  }

  static async findAll() {
    const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users');
    const result = rows.map((row) => new User(...Object.values(row)));
    return result;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users WHERE id_user = ?', [id]);
    const result = rows.map((row) => new User(...Object.values(row)));
    return result[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT username, email, password, verification_token, role, is_verified, id_user FROM users WHERE email = ?', [email]);
    const result = rows.map((row) => new User(...Object.values(row)));
    return result[0];
  }

  static async verifyUser(token) {
    // Étape 1 : On recherche l'utilisateur avec le token de vérification
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

    // Étape 2 : On marque l'utilisateur comme vérifié
    await db.query(`
        UPDATE users
        SET is_verified = true,
        verification_token = NULL
        WHERE id_user = ?
      `, [userId]);

    return { message: 'Compte vérifié avec succès' };
  }
}

module.exports = User;
