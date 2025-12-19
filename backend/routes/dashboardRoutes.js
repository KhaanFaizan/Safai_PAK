const express = require('express');
const router = express.Router();
const { getProviderStats } = require('../controllers/dashboardController');
const { protect, verifiedProviderOnly } = require('../middleware/authMiddleware');

router.get('/', protect, verifiedProviderOnly, getProviderStats);

module.exports = router;
