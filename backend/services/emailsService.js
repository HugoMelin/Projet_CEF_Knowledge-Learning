const crypto = require('crypto');
const transporter = require('../config/email');

/**
 * Generates a random verification token.
 * @function generateVerificationToken
 * @returns {string} A random 32-byte hex string.
 */
exports.generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Sends a verification email to the user.
 * @async
 * @function sendVerificationEmail
 * @param {string} email - The recipient's email address.
 * @returns {Promise<string>} The verification token.
 * @throws {Error} If there's an error sending the email.
 */
exports.sendVerificationEmail = async (email) => {
  try {
    const verificationToken = exports.generateVerificationToken();
    const verificationLink = `${process.env.API_URL}verify/${verificationToken}`;

    await transporter.sendMail({
      from: '"Knowledge Learning" <noreply@knowledge.com>',
      to: email,
      subject: 'Vérifiez votre compte',
      html: `Cliquez sur ce lien pour vérifier votre compte : <a href="${verificationLink}">${verificationLink}</a>`,
    });

    return verificationToken;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};
