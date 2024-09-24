const db = require('../database/database');

class User {
  constructor(idUser, username, email, password, role = "['role-user']", isVerified = 0, verificationToken = null, createdAt = new Date(), modifiedAt = new Date()) {
    this.idUser = idUser;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isVerified = isVerified;
    this.verificationToken = verificationToken;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM users');
    const result = rows.map((row) => new User(...Object.values(row)));
    return result;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id_user = ?', [id]);
    const result = rows.map((row) => new User(...Object.values(row)));
    return result[0];
  }
}

module.exports = User;
