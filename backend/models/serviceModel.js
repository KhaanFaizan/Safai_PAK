const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add a service name'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        duration: {
            type: String,
            required: [true, 'Please add a duration (e.g., 2 hours)'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['House Cleaning', 'Pest Control', 'Agricultural Services', 'Deep Sanitation', 'Office Cleaning'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Service', serviceSchema);
