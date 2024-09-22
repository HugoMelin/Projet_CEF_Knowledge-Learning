const crypto = require('crypto');

const transporter = require('../config/email');

exports.generateVerificationToken = () => {
  const randomToken = crypto.randomBytes(32).toString('hex');
  return randomToken;
};

exports.sendVerificationEmail = async (email) => {
  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationLink = `${process.env.API_URL}verify/${verificationToken}`;

    await transporter.sendMail({
      from: '"Knowledge Learning" <noreply@knowledge.com>',
      to: email,
      subject: 'Vérifiez votre compte',
      html: `Cliquez sur ce lien pour vérifier votre compte : <a href="${verificationLink}">${verificationLink}</a>`,
    });

    return verificationToken;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};
