const express = require('express');
const router = express.Router();

// @desc    Health check
// @route   GET /api/health
// @access  Public
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

module.exports = router;
