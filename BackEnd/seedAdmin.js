const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/database');

const seedUsers = async () => {
    try {
        await connectDB();
        console.log('🌱 Starting User Seeding Process...');

        const demoAccounts = [
            {
                name: 'System Administrator',
                username: 'admin',
                email: 'admin@papervault.edu',
                password: 'Password123!',
                role: 'admin',
                isEmailVerified: true,
                university: 'SPPU',
                college: 'Pune Engineering College',
                branch: 'Computer Engineering'
            },
            {
                name: 'Dr. Ramesh Kulkarni',
                username: 'faculty',
                email: 'faculty@papervault.edu',
                password: 'Password123!',
                role: 'faculty',
                isEmailVerified: true,
                university: 'SPPU',
                college: 'Pune Engineering College',
                branch: 'Information Technology'
            },
            {
                name: 'Satish Rathod',
                username: 'student',
                email: 'student@papervault.edu',
                password: 'Password123!',
                role: 'student',
                isEmailVerified: true,
                university: 'SPPU',
                college: 'Pune Engineering College',
                branch: 'Computer Engineering'
            }
        ];

        for (const account of demoAccounts) {
            let user = await User.findOne({ email: account.email });
            if (user) {
                user.role = account.role;
                user.isEmailVerified = true;
                user.password = account.password; // Mongoose schema will hash via pre-save
                await user.save();
                console.log(`✅ Updated existing account: ${account.role.toUpperCase()} -> ${account.email}`);
            } else {
                user = new User(account);
                await user.save();
                console.log(`✨ Created new account: ${account.role.toUpperCase()} -> ${account.email}`);
            }
        }

        console.log('\n===================================================');
        console.log('🎉 Admin & System Accounts Seeded Successfully!');
        console.log('---------------------------------------------------');
        console.log('🔑 Admin Account:   admin@papervault.edu   / Password123!');
        console.log('🔑 Faculty Account: faculty@papervault.edu / Password123!');
        console.log('🔑 Student Account: student@papervault.edu / Password123!');
        console.log('===================================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during user seeding:', error);
        process.exit(1);
    }
};

seedUsers();
