const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config({ path: 'c:\\Users\\dell\\Desktop\\SAFAI_PAK\\.env' });

connectDB();

const seedAdmin = async () => {
    try {
        console.log('Connecting to DB...');

        // Wait for connection
        setTimeout(async () => {
            // Check if admin exists
            const existingAdmin = await User.findOne({ email: 'muhammadfaizankhan588@gmail.com' });
            if (existingAdmin) {
                console.log('Admin already exists, updating password/role...');
                existingAdmin.password = 'F@izan4121';
                existingAdmin.role = 'admin';
                existingAdmin.isVerified = true;
                await existingAdmin.save();
                console.log('Admin updated successfully');
            } else {
                await User.create({
                    name: 'Muhammad Faizan Khan',
                    email: 'muhammadfaizankhan588@gmail.com',
                    password: 'F@izan4121',
                    phone: '03085101230',
                    city: 'Islamabad',
                    role: 'admin',
                    isVerified: true
                });
                console.log('Admin created successfully');
            }
            process.exit();
        }, 3000);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
