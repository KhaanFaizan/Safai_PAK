const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');
const User = require('../models/userModel');
const notify = require('../utils/notify');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = asyncHandler(async (req, res) => {
    const { serviceId, scheduledDate, address } = req.body;

    if (!serviceId || !scheduledDate || !address) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const service = await Service.findById(serviceId);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    const booking = await Booking.create({
        customer: req.user.id,
        provider: service.user,
        service: serviceId,
        scheduledDate,
        address,
    });

    // Notify Provider
    await notify(
        service.user,
        'booking_create',
        'New Booking Request',
        `📅 New booking from ${req.user.name} for ${service.name}.`,
        booking._id,
        req.user.id
    );

    res.status(201).json(booking);
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
    let bookings;

    if (req.user.role === 'customer') {
        bookings = await Booking.find({ customer: req.user.id })
            .populate('service', 'name price category')
            .populate('provider', 'name email phone');
    } else if (req.user.role === 'provider') {
        bookings = await Booking.find({ provider: req.user.id })
            .populate('service', 'name price category')
            .populate('customer', 'name email phone');
    } else {
        // Admin or others (if applicable) can see all, or restrict
        bookings = await Booking.find({})
            .populate('service', 'name price')
            .populate('customer', 'name')
            .populate('provider', 'name');
    }

    res.status(200).json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Provider Logic
    if (req.user.role === 'provider') {
        if (booking.provider.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to update this booking');
        }
        // Provider can move to accepted, completed, cancelled
        if (['accepted', 'completed', 'cancelled'].includes(status)) {
            booking.status = status;
        } else {
            res.status(400);
            throw new Error('Invalid status update for provider');
        }

        // Notify Customer based on Provider action
        let title, message;
        if (status === 'accepted') {
            title = 'Booking Accepted';
            message = `✅ Good news! Your booking has been accepted by provider.`;
        } else if (status === 'completed') {
            title = 'Service Completed';
            message = `🌟 Service completed! Please rate your experience.`;

            // Notify Admin specifically for completion
            await booking.populate('customer', 'name');
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                await notify(
                    admin._id,
                    'system',
                    'Service Completed',
                    `Provider ${req.user.name} completed service with Customer ${booking.customer.name}.`,
                    booking._id
                );
            }
        } else if (status === 'cancelled') {
            title = 'Booking Cancelled';
            message = `❌ Your booking was cancelled by the provider.`;
        }

        if (title) {
            await notify(
                booking.customer._id || booking.customer,
                `booking_${status}`,
                title,
                message,
                booking._id,
                req.user.id
            );
        }
    }
    // Customer Logic
    else if (req.user.role === 'customer') {
        if (booking.customer.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to update this booking');
        }
        // Customer can only cancel if pending
        if (status === 'cancelled' && booking.status === 'pending') {
            booking.status = status;
        } else {
            res.status(400);
            throw new Error('Customer can only cancel pending bookings');
        }

        // Notify Provider of Cancellation
        if (status === 'cancelled') {
            await notify(
                booking.provider,
                'booking_cancel',
                'Booking Cancelled',
                `❌ Customer ${req.user.name} cancelled their booking.`,
                booking._id,
                req.user.id
            );
        }
    }
    else {
        res.status(403);
        throw new Error('Not authorized');
    }

    const updatedBooking = await booking.save();
    res.status(200).json(updatedBooking);
});

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus,
};
