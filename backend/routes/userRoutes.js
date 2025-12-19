const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getProviderProfile, getUsers, verifyProvider, suspendUser } = require('../controllers/userController');

router.get('/providers/:id', getProviderProfile);
router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/:id/verify').put(protect, authorize('admin'), verifyProvider);
router.route('/:id/suspend').put(protect, authorize('admin'), suspendUser);

module.exports = router;
