require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const makeAdmin = async (email, name, password) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Connected to MongoDB');
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            if (!name || !password) {
                console.log('User not found. To create a new admin user, provide name and password:');
                console.log('Usage: node scripts/makeAdmin.js <email> <name> <password>');
                console.log('Example: node scripts/makeAdmin.js admin@example.com "Admin User" "password123"');
                process.exit(1);
            }

            user = await User.create({
                name,
                email: email.toLowerCase(),
                password,
                role: 'admin'
            });

            console.log(`Created new admin user: ${user.name} (${user.email})`);
        } else {
            user.role = 'admin';
            await user.save();

            console.log(`User ${user.name} (${user.email}) is now an admin`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const email = process.argv[2];
const name = process.argv[3];
const password = process.argv[4];

if (!email) {
    console.log('Usage:');
    console.log('  Promote existing user:  node scripts/makeAdmin.js <email>');
    console.log('  Create new admin:       node scripts/makeAdmin.js <email> <name> <password>');
    console.log('\nExamples:');
    console.log('  node scripts/makeAdmin.js user@example.com');
    console.log('  node scripts/makeAdmin.js admin@example.com "Admin User" "password123"');
    process.exit(1);
}

makeAdmin(email, name, password);
