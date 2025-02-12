const express = require('express');
const userRoutes = require('../routes/user');
const reportingFormRoutes = require('../routes/reportingForm');
const dataRoutes = require('../routes/data');
const { authenticate } = require('../middlewares/JWTMiddleware');

const router = express.Router();

// Attach the user routes
router.use('/', userRoutes);
router.use('/', authenticate, dataRoutes);
router.use('/', authenticate, reportingFormRoutes);

module.exports = router;