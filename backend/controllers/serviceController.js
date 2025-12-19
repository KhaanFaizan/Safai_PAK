const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const category = req.query.category
        ? {
            category: req.query.category,
        }
        : {};

    const count = await Service.countDocuments({ ...keyword, ...category });
    const services = await Service.find({ ...keyword, ...category })
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
        'name email'
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
