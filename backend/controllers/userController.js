const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');

// @desc    Get provider profile and services
// @route   GET /api/users/providers/:id
// @access  Public
const getProviderProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select(
        '-password -createdAt -updatedAt'
    );

    if (!user || user.role !== 'provider') {
        res.status(404);
        throw new Error('Provider not found');
    }

    const services = await Service.find({ user: user._id });

    res.json({
        provider: user,
        services,
    });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Verify provider
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
const verifyProvider = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isVerified = req.body.isVerified;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Suspend/Activate user
// @route   PUT /api/users/:id/suspend
// @access  Private/Admin
const suspendUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isSuspended = !user.isSuspended;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isSuspended: updatedUser.isSuspended,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getProviderProfile,
    getUsers,
    verifyProvider,
    suspendUser,
};
