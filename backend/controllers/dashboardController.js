const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const mongoose = require('mongoose');

// @desc    Get provider dashboard statistics
// @route   GET /api/dashboard
// @access  Private (Verified Provider)
const getProviderStats = asyncHandler(async (req, res) => {
    const providerId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Get Booking Counts by Status
    const statusStats = await Booking.aggregate([
        { $match: { provider: providerId } },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    // Format status counts (ensure all statuses have keys even if 0)
    const statsMap = {
        pending: 0,
        accepted: 0,
        completed: 0,
        cancelled: 0,
    };
    statusStats.forEach((stat) => {
        statsMap[stat._id] = stat.count;
    });

    // 2. Calculate Earnings (Total and Monthly)
    // We need to join with Service to get the price
    const earningsStats = await Booking.aggregate([
        {
            $match: {
                provider: providerId,
                status: 'completed',
            },
        },
        {
            $lookup: {
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'serviceData',
            },
        },
        {
            $unwind: '$serviceData',
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: '$serviceData.price' },
                monthly: {
                    $push: {
                        month: { $month: '$scheduledDate' },
                        year: { $year: '$scheduledDate' },
                        amount: '$serviceData.price',
                    },
                },
            },
        },
    ]);

    // Process monthly data from the gathered array or use group by date in aggregation
    // Let's refine the aggregation to group by date directly for cleaner output
    const monthlyAgg = await Booking.aggregate([
        {
            $match: {
                provider: providerId,
                status: 'completed',
            },
        },
        {
            $lookup: {
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'serviceData',
            },
        },
        { $unwind: '$serviceData' },
        {
            $group: {
                _id: {
                    month: { $month: '$scheduledDate' },
                    year: { $year: '$scheduledDate' },
                },
                monthlyEarnings: { $sum: '$serviceData.price' },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const totalEarnings = earningsStats.length > 0 ? earningsStats[0].totalEarnings : 0;

    res.json({
        bookings: {
            total: statsMap.pending + statsMap.accepted + statsMap.completed + statsMap.cancelled,
            ...statsMap,
        },
        earnings: {
            total: totalEarnings,
            monthly: monthlyAgg.map(m => ({
                month: m._id.month,
                year: m._id.year,
                amount: m.monthlyEarnings
            }))
        },
        rating: req.user.rating, // Taken from User model updated by reviews
        numReviews: req.user.numReviews
    });
});

module.exports = {
    getProviderStats,
};
