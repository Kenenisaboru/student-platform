const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        const users = await User.find({}).select('name email role');
        console.log('Registered Users:');
        console.table(users);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
