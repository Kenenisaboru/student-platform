require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const users = await User.find({}).select('name email role isVerified');
    
    console.log('=== ALL USERS ===\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.isVerified ? '✅ YES' : '❌ NO'}`);
      console.log('');
    });

    console.log(`Total Users: ${users.length}`);
    console.log(`Verified: ${users.filter(u => u.isVerified).length}`);
    console.log(`Unverified: ${users.filter(u => !u.isVerified).length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
