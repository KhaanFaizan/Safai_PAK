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

module.exports = {
    getProviderProfile,
};
