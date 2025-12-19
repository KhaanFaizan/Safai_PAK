const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Service',
        },
        scheduledDate: {
            type: Date,
            required: [true, 'Please add a scheduled date'],
        },
        address: {
            type: String,
            required: [true, 'Please add an address'],
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'accepted', 'completed', 'cancelled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
