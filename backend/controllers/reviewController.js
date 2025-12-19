const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Customer)
const createReview = asyncHandler(async (req, res) => {
    const { rating, comment, bookingId } = req.body;

    if (!rating || !comment || !bookingId) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // 1. Fetch Booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // 2. Validate Ownership (Must be the customer)
    if (booking.customer.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to review this booking');
    }

    // 3. Validate Status (Must be completed)
    if (booking.status !== 'completed') {
        res.status(400);
        throw new Error('Can only review completed bookings');
    }

    // 4. Validate Duplicate (Handled by unique index in model mostly, but checked here too)
    const reviewExists = await Review.findOne({ booking: bookingId });
    if (reviewExists) {
        res.status(400);
        throw new Error('Review already submitted for this booking');
    }

    // Create Review
    const review = await Review.create({
        rating,
        comment,
        customer: req.user.id,
        provider: booking.provider,
        service: booking.service,
        booking: bookingId,
    });

    // 5. Update Provider Rating (Aggregation)
    const stats = await Review.aggregate([
        {
            $match: { provider: booking.provider },
        },
        {
            $group: {
                _id: '$provider',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await User.findByIdAndUpdate(booking.provider, {
            rating: stats[0].averageRating,
            numReviews: stats[0].numReviews,
        });
    }

    res.status(201).json(review);
});

// @desc    Get reviews for a provider
// @route   GET /api/reviews/provider/:id
// @access  Public
const getProviderReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ provider: req.params.id })
        .populate('customer', 'name')
        .populate('service', 'name');

    res.json(reviews);
});

module.exports = {
    createReview,
    getProviderReviews,
};
