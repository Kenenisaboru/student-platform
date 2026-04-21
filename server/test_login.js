const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const testUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete test user if exists
        await User.deleteOne({ email: 'test_login@example.com' });

        console.log('Creating user...');
        const user = await User.create({
            name: 'Test Login',
            email: 'test_login@example.com',
            password: 'Password123!',
            university: 'AAU',
            department: 'CS',
            role: 'student'
        });
        
        console.log('Hash after create:', user.password);

        user.createVerificationToken();
        await user.save({ validateBeforeSave: false });
        
        console.log('Hash after save:', user.password);

        const fetchedUser = await User.findOne({ email: 'test_login@example.com' });
        console.log('Fetched hash:', fetchedUser.password);

        const isMatch = await fetchedUser.comparePassword('Password123!');
        console.log('Password match?', isMatch);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testUser();
