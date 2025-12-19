const express = require('express');
const router = express.Router();
const {
    getUnverifiedProviders,
    verifyProvider,
    rejectProvider,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/providers/unverified', getUnverifiedProviders);
router.put('/providers/:id/verify', verifyProvider);
router.delete('/providers/:id/reject', rejectProvider);

module.exports = router;
