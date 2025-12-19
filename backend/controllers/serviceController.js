const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    // Build query
    const query = {};

    // 1. Keyword Search
    if (req.query.keyword) {
        query.name = { $regex: req.query.keyword, $options: 'i' };
    }

    // 2. Category Filter
    if (req.query.category) {
        query.category = req.query.category;
    }

    // 3. Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 4. Provider Filters (City, Rating)
    let providerIds = null;
    if (req.query.city || req.query.rating) {
        const userQuery = {};
        if (req.query.city) {
            userQuery.city = { $regex: req.query.city, $options: 'i' };
        }
        if (req.query.rating) {
            userQuery.rating = { $gte: Number(req.query.rating) };
        }

        const matchedProviders = await require('../models/userModel')
            .find(userQuery)
            .select('_id');
        providerIds = matchedProviders.map((p) => p._id);

        // If we're filtering by provider attrs and found none, return empty immediately
        if (providerIds.length === 0) {
            return res.json({ services: [], page, pages: 0 });
        }

        query.user = { $in: providerIds };
    }

    const count = await Service.countDocuments(query);
    const services = await Service.find(query)
        .populate('user', 'name city rating numReviews')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ services, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id).populate(
        'user',
        'name email rating numReviews'
    );

    if (service) {
        res.json(service);
    } else {
        res.status(404);
        throw new Error('Service not found');
    }
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private (Verified Provider only)
const createService = asyncHandler(async (req, res) => {
    const { name, description, price, duration, category } = req.body;

    if (!name || !description || !price || !duration || !category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const service = await Service.create({
        user: req.user.id,
        name,
        description,
        price,
        duration,
        category,
    });

    res.status(201).json(service);
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Verified Provider owner only)
const updateService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the service user
    if (service.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );

    res.json(updatedService);
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Verified Provider owner only)
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the service user
    if (service.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await service.deleteOne();

    res.json({ id: req.params.id });
});

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
