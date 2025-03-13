const express = require('express');
const userRoutes = require('../routes/user');
const reportingFormRoutes = require('../routes/reportingForm');
const dataRoutes = require('../routes/data');
const { authenticate } = require('../middlewares/JWTMiddleware');
const activityRoutes = require('../routes/activityLogRoutes');
const activityLogMiddleware = require('../middlewares/activityLogMiddleware');

const router = express.Router();

// Attach the user routes
router.use('/', userRoutes);
router.use('/',  dataRoutes);
router.use('/', authenticate, reportingFormRoutes);
router.use('/', activityRoutes)

module.exports = router;