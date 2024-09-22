const bcrypt = require('bcrypt');

const pool = require('../database/database');
const { sendVerificationEmail } = require('./emailsService');

exports.createUser = async (userData) => {
  const {
    username,
    email,
    password,
    role = "['role-user']",
    isVerified = false,
  } = userData;

  try {
    // On vérifie si l'email existe déjà
    const [existingUser] = await pool.query(`
      SELECT * 
      FROM users 
      WHERE email = ?`, [email]);
    if (existingUser.length > 0) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // On hash le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Système de validation par mail
    const verificationToken = await sendVerificationEmail(email);

    // On insère le nouvel utilisateur
    const [result] = await pool.query(`
      INSERT 
      INTO users (username, email, password, role, is_verified, verification_token)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [username, email, hashedPassword, role, isVerified, verificationToken]);

    // On récupère l'utilisateur nouvellement créé
    const [newUser] = await pool.query(`
      SELECT id_user, username, email, role, is_verified 
      FROM users 
      WHERE id_user = ?
    `, [result.insertId]);

    return newUser[0];
  } catch (error) {
    // On envoie un message spécifique si l'email de l'utilisateur est déjà utilisé
    if (error.message === 'Un utilisateur avec cet email existe déjà') {
      throw error;
    }
    // On envoie un message spécifique si l'email de l'utilisateur est déjà utilisé
    // mais cette fois ave cla validation par le code d'erreur
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Cet email est déjà utilisé');
    }

    // Pour les autres types d'erreurs, on lance une erreur générique
    throw new Error('Une erreur est survenue lors de la création de l\'utilisateur');
  }
};

exports.getAllusers = async () => {
  try {
    const [users] = await pool.query(`
      SELECT *
      FROM users;
    `);

    if (users.length === 0) {
      // Si aucun utilisateur n'est trouvé, on lance une erreur spécifique
      throw new Error('Aucun utilisateur trouvé');
    }

    return users;
  } catch (error) {
    // Si l'erreur est "Aucun utilisateur trouvé", on la renvoie telle quelle
    if (error.message === 'Aucun utilisateur trouvé') {
      throw error;
    }

    // Pour les autres types d'erreurs, on lance une erreur générique
    throw new Error('Une erreur est survenue lors de la récupération des utilisateurs');
  }
};

exports.getUser = async (id) => {
  try {
    const [users] = await pool.query(`
      SELECT *
      FROM users
      WHERE id_user = ?;
    `, [id]);

    if (users.length === 0) {
      // Si aucun utilisateur n'est trouvé, on lance une erreur spécifique
      throw new Error('Utilisateur non trouvé');
    }

    return users[0];
  } catch (error) {
    // Si l'erreur est "Utilisateur non trouvé", on la renvoie telle quelle
    if (error.message === 'Utilisateur non trouvé') {
      throw error;
    }

    // Pour les autres types d'erreurs, on lance une erreur générique
    throw new Error('Une erreur est survenue lors de la récupération de l\'utilisateur');
  }
};

exports.deleteUser = async (id) => {
  try {
    // D'abord, on récupère l'username de l'utilisateur
    const [userToDelete] = await pool.query(`
      SELECT username
      FROM users
      WHERE id_user = ?
    `, [id]);

    if (userToDelete.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    const { username } = userToDelete[0];

    // Ensuite, on supprime l'utilisateur
    const [result] = await pool.query(`
      DELETE 
      FROM users 
      WHERE id_user = ?
    `, [id]);

    if (result.affectedRows === 0) {
      // Cette condition ne devrait normalement jamais être atteinte
      // si la vérification précédente a réussi
      throw new Error('Échec de la suppression de l\'utilisateur');
    }

    return { message: 'Utilisateur supprimé avec succès', deletedUsername: username };
  } catch (error) {
    // Si l'erreur est "Utilisateur non trouvé", on la renvoie telle quelle
    if (error.message === 'Utilisateur non trouvé') {
      throw error;
    }

    // Pour les autres types d'erreurs, on lance une erreur générique
    throw new Error('Une erreur est survenue lors de la suppression de l\'utilisateur');
  }
};

exports.updateUser = async (id, userData) => {
  const {
    username,
    email,
    password,
    role,
    isVerified,
  } = userData;

  try {
    const [updateResult] = await pool.query(`
      UPDATE users 
      SET 
        username = COALESCE(?, username),
        email = COALESCE(?, email),
        password = COALESCE(?, password),
        role = COALESCE(?, role),
        is_verified = COALESCE(?, is_verified)
      WHERE id_user = ?;
      `, [username, email, password, role, isVerified, id]);

    // Vérifie si une ligne a été affectée
    if (updateResult.affectedRows === 0) {
      throw new Error('Aucun utilisateur trouvé avec cet ID');
    }

    // Récupère et retourne l'utilisateur mis à jour
    const [updatedUsers] = await pool.query('SELECT * FROM users WHERE id_user = ?', [id]);

    if (updatedUsers.length === 0) {
      throw new Error('Utilisateur non trouvé après la mise à jour');
    }

    return updatedUsers[0];
  } catch (error) {
    // Rethrow l'erreur avec un message plus spécifique
    throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
  }
};
