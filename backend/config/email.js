const nodemailer = require('nodemailer');

/**
 * Creates an email transporter using Nodemailer.
 * This transporter is configured to use either environment-specified SMTP settings
 * or default to a local MailHog instance for development purposes.
 *
 * @constant {nodemailer.Transporter}
 */
const transporter = nodemailer.createTransport({
  // Use environment variable for SMTP host or default to localhost
  host: process.env.SMTP_HOST || 'http://127.0.0.1/',

  // Use environment variable for SMTP port or default to MailHog's default port
  port: process.env.SMTP_PORT || 1025,

  ignoreTLS: true,
});

module.exports = transporter;
