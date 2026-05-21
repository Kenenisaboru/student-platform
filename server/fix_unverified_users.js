/**
 * Migration script to fix users who are stuck with isVerified: false
 * when email is not configured.
 * 
 * Run this once with: node fix_unverified_users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const isEmailConfigured = () => {
  const host = process.env.EMAIL_HOST?.trim();
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  if (!host || !user || !pass) return false;
  if (user.includes('your_email') || pass.includes('your_app_password')) return false;
  return true;
};

async function fixUnverifiedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const emailConfigured = isEmailConfigured();
    console.log(`Email configured: ${emailConfigured}`);

    if (!emailConfigured) {
      // If email is not configured, verify all unverified users
      const result = await User.updateMany(
        { isVerified: false },
        { $set: { isVerified: true } }
      );
      
      console.log(`✅ Fixed ${result.modifiedCount} unverified users`);
      console.log('All users can now use the platform without email verification.');
    } else {
      console.log('Email is configured. No automatic verification needed.');
      console.log('Users must verify their email addresses through the verification link.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

fixUnverifiedUsers();
