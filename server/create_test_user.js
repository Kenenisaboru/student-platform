const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const testEmail = 'test@example.com';
        const userExists = await User.findOne({ email: testEmail });

        if (userExists) {
            console.log(`User ${testEmail} already exists.`);
        } else {
            const user = await User.create({
                name: 'Test Student',
                email: testEmail,
                password: 'password123',
                university: 'AAU',
                department: 'Computer Science',
                role: 'student',
                isVerified: true
            });
            console.log('Test user created successfully!');
            console.log('Email: test@example.com');
            console.log('Password: password123');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestUser();
