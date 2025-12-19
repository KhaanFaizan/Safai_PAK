const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/userModel');
const Service = require('./models/serviceModel');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedData = async () => {
    try {
        await connectDB();

        // 1. Clear existing data
        await Service.deleteMany();
        await User.deleteMany();

        console.log('Data cleared...');

        // 2. Create Providers
        const provider1 = await User.create({
            name: 'Ali Khan',
            email: 'ali@example.com',
            password: 'password123',
            role: 'provider',
            phone: '03001234567',
            city: 'Lahore',
            verified: true,
            rating: 4.5,
            numReviews: 10
        });

        const provider2 = await User.create({
            name: 'Sara Ahmed',
            email: 'sara@example.com',
            password: 'password123',
            role: 'provider',
            phone: '03007654321',
            city: 'Karachi',
            verified: true,
            rating: 4.8,
            numReviews: 5
        });

        console.log('Providers created...');

        // 3. Create Services
        const services = [
            {
                user: provider1._id,
                name: 'House Cleaning',
                description: 'Complete house cleaning service including dusting, mopping, and vacuuming. We use eco-friendly products.',
                price: 2500,
                category: 'Sanitation & Cleaning',
                duration: '3 hours'
            },
            {
                user: provider1._id,
                name: 'Pest Control Service',
                description: 'Deep treatment for termites, cockroaches, and bed bugs.',
                price: 5000,
                category: 'Pest Control',
                duration: '1 hour'
            },
            {
                user: provider2._id,
                name: 'Agricultural Spray',
                description: 'Expert crop spraying service for pests.',
                price: 3000,
                category: 'Agricultural Services',
                duration: '2 hours'
            },
            {
                user: provider2._id,
                name: 'Deep Sanitation',
                description: 'Disinfect your entire home or office.',
                price: 4000,
                category: 'Sanitation & Cleaning',
                duration: '4 hours'
            },
            {
                user: provider1._id,
                name: 'Office Cleaning',
                description: 'Professional office cleaning service.',
                price: 1200,
                category: 'Sanitation & Cleaning',
                duration: '2 hours'
            }
        ];

        await Service.insertMany(services);
        console.log('Services Imported!');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
