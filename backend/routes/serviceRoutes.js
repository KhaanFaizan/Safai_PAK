const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} = require('../controllers/serviceController');
const { protect, verifiedProviderOnly } = require('../middleware/authMiddleware');

router.route('/').get(getServices).post(protect, verifiedProviderOnly, createService);
router
    .route('/:id')
    .get(getServiceById)
    .put(protect, verifiedProviderOnly, updateService)
    .delete(protect, verifiedProviderOnly, deleteService);

module.exports = router;
