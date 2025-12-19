const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config({ path: 'c:\\Users\\dell\\Desktop\\SAFAI_PAK\\.env' });

connectDB();

const verifyProviders = async () => {
    try {
        console.log('Connecting to DB...');
        // Wait a bit for connection
        setTimeout(async () => {
            const result = await User.updateMany(
                { role: 'provider' },
                { $set: { isVerified: true } }
            );

            console.log(`Verified ${result.modifiedCount} providers`);
            process.exit();
        }, 3000);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyProviders();
