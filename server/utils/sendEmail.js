const nodemailer = require('nodemailer');

const isEmailConfigured = () => {
  const host = process.env.EMAIL_HOST?.trim();
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  if (!host || !user || !pass) return false;
  if (user.includes('your_email') || pass.includes('your_app_password')) return false;
  return true;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email service is not configured');
    }
    console.warn(`[email skipped] To: ${to} | Subject: ${subject}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Communication Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
module.exports.isEmailConfigured = isEmailConfigured;
