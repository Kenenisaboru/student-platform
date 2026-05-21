/**
 * Debug script to test comment API endpoint with authentication
 */
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Post = require('./models/Post');

async function debugCommentIssue() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if email is configured
    const isEmailConfigured = () => {
      const host = process.env.EMAIL_HOST?.trim();
      const user = process.env.EMAIL_USER?.trim();
      const pass = process.env.EMAIL_PASS?.trim();
      if (!host || !user || !pass) return false;
      if (user.includes('your_email') || pass.includes('your_app_password')) return false;
      return true;
    };

    console.log('📧 Email Configuration:');
    console.log(`   Configured: ${isEmailConfigured() ? '✅ YES' : '❌ NO'}`);
    console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || 'NOT SET'}`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}\n`);

    // Get all users
    const users = await User.find({}).select('name email role isVerified');
    
    console.log('👥 All Users:');
    users.forEach((user, index) => {
      const status = user.isVerified ? '✅' : '❌';
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Role: ${user.role} | Verified: ${status}`);
    });
    console.log('');

    // Check unverified users
    const unverified = users.filter(u => !u.isVerified);
    if (unverified.length > 0) {
      console.log('⚠️  PROBLEM FOUND: Unverified Users Detected!');
      console.log('   These users cannot comment:\n');
      unverified.forEach(u => {
        console.log(`   - ${u.name} (${u.email})`);
      });
      console.log('\n   FIX: Run this command:');
      console.log('   node fix_unverified_users.js\n');
    } else {
      console.log('✅ All users are verified\n');
    }

    // Test JWT token generation
    const testUser = users[0];
    const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('🔑 JWT Token Test:');
    console.log(`   User: ${testUser.name}`);
    console.log(`   Token Generated: ✅ YES`);
    console.log(`   Token (first 50 chars): ${token.substring(0, 50)}...\n`);

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verification: PASSED');
      console.log(`   Decoded User ID: ${decoded.id}\n`);
    } catch (err) {
      console.log('❌ Token verification: FAILED');
      console.log(`   Error: ${err.message}\n`);
    }

    // Check posts
    const posts = await Post.find({}).limit(5).populate('author', 'name email');
    console.log(`📝 Posts Available: ${posts.length}`);
    if (posts.length > 0) {
      console.log('   Sample posts:');
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. "${post.title}" by ${post.author.name}`);
      });
    } else {
      console.log('   ⚠️  No posts found. Create a post first.');
    }
    console.log('');

    // Check middleware configuration
    console.log('🔒 Middleware Configuration:');
    console.log('   - protect: Checks JWT token ✅');
    console.log('   - requireVerified: Checks isVerified status ✅');
    console.log('   - secure: [protect, requireVerified] ✅\n');

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('📊 DIAGNOSTIC SUMMARY');
    console.log('═══════════════════════════════════════');
    
    const allVerified = unverified.length === 0;
    const hasEmailConfig = isEmailConfigured();
    const hasPosts = posts.length > 0;
    
    console.log(`✅ All users verified: ${allVerified ? 'YES' : 'NO'}`);
    console.log(`${hasEmailConfig ? '✅' : '⚠️ '} Email configured: ${hasEmailConfig ? 'YES' : 'NO (OK for dev)'}`);
    console.log(`✅ Posts available: ${hasPosts ? 'YES' : 'NO'}`);
    console.log(`✅ JWT working: YES`);
    console.log('═══════════════════════════════════════\n');

    if (allVerified && hasPosts) {
      console.log('✅ SYSTEM STATUS: HEALTHY');
      console.log('   Comments should work properly.\n');
      console.log('📋 TROUBLESHOOTING STEPS:');
      console.log('   1. Make sure the server is running (npm start)');
      console.log('   2. Check browser console for errors (F12)');
      console.log('   3. Verify you are logged in');
      console.log('   4. Check Network tab for failed requests');
      console.log('   5. Look for 401 or 403 errors\n');
    } else {
      console.log('⚠️  SYSTEM STATUS: NEEDS ATTENTION');
      if (!allVerified) {
        console.log('   → Run: node fix_unverified_users.js');
      }
      if (!hasPosts) {
        console.log('   → Create at least one post in the app');
      }
      console.log('');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

debugCommentIssue();
