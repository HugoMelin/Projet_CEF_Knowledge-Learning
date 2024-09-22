/* eslint-disable no-useless-catch */
const pool = require('../database/database');

exports.verifyUser = async (token) => {
  try {
    // Étape 1 : On recherche l'utilisateur avec le token de vérification
    const [users] = await pool.query(`
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
    await pool.query(`
      UPDATE users
      SET is_verified = true,
      verification_token = NULL
      WHERE id_user = ?
    `, [userId]);

    return { message: 'Compte vérifié avec succès' };
  } catch (error) {
    throw error;
  }
};
