const express = require('express');
const userRoutes = require('../routes/user'); 

const router = express.Router();

// Attach the user routes
router.use('/v1/user', userRoutes);

module.exports = router;