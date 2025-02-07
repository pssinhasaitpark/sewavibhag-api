const express = require('express');
const userRoutes = require('../routes/user'); 
const reportingFormRoutes = require('../routes/reportingForm'); 
const dataRoutes = require('../routes/data'); 

const router = express.Router();

// Attach the user routes
router.use('/', userRoutes);
router.use('/', reportingFormRoutes);
router.use('/', dataRoutes);

module.exports = router;