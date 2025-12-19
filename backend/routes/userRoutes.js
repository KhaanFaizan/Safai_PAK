const express = require('express');
const router = express.Router();
const { getProviderProfile } = require('../controllers/userController');

router.get('/providers/:id', getProviderProfile);

module.exports = router;
