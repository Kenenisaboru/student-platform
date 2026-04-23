const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedCredentials = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Regular Student
        const studentEmail = 'student@example.com';
        const studentPassword = 'Password123!';

        // Admin (Using one from .env list)
        const adminEmail = 'kananiman710@gmail.com';
        const adminPassword = 'AdminPassword123!';

        // Delete existing if any to ensure clean credentials
        await User.deleteOne({ email: studentEmail });
        await User.deleteOne({ email: adminEmail });

        const student = await User.create({
            name: 'Sample Student',
            email: studentEmail,
            password: studentPassword, // This WILL be hashed by model pre-save hook
            university: 'AAU',
            department: 'Computer Science',
            role: 'student',
            isVerified: true
        });

        const admin = await User.create({
            name: 'Arsi Aseko Admin',
            email: adminEmail,
            password: adminPassword,
            university: 'Adama Science & Tech',
            department: 'Administration',
            role: 'admin',
            isVerified: true
        });

        console.log('\n✅ Credentials Seeded Successfuly!');
        console.log('-------------------------------');
        console.log('STUDENT ACCESS:');
        console.log('Email: ' + studentEmail);
        console.log('Pass:  ' + studentPassword);
        console.log('-------------------------------');
        console.log('ADMIN ACCESS:');
        console.log('Email: ' + adminEmail);
        console.log('Pass:  ' + adminPassword);
        console.log('-------------------------------');

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding credentials:', err);
        process.exit(1);
    }
};

seedCredentials();
