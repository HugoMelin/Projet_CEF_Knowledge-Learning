const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'http://127.0.0.1/',
  port: process.env.SMTP_PORT || 1025, // Port SMTP de MailHog
  ignoreTLS: true,
});

module.exports = transporter;
