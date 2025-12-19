const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Get all unverified providers
// @route   GET /api/admin/providers/unverified
// @access  Private/Admin
const getUnverifiedProviders = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'provider', isVerified: false }).select(
        '-password'
    );
    res.status(200).json(users);
});

// @desc    Verify a provider
// @route   PUT /api/admin/providers/:id/verify
// @access  Private/Admin
const verifyProvider = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'provider') {
        user.isVerified = true;
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            isVerified: updatedUser.isVerified,
        });
    } else {
        res.status(404);
        throw new Error('Provider not found');
    }
});

// @desc    Reject (delete) a provider application
// @route   DELETE /api/admin/providers/:id/reject
// @access  Private/Admin
const rejectProvider = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'provider') {
        await user.deleteOne();
        res.status(200).json({ message: 'Provider rejected and removed' });
    } else {
        res.status(404);
        throw new Error('Provider not found');
    }
});

module.exports = {
    getUnverifiedProviders,
    verifyProvider,
    rejectProvider,
};
