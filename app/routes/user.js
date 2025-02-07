const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user');
const { verifyToken, verifyRole } = require('../middlewares/JWTMiddleware');
const { successResponse } = require('../utils/helper');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
    return successResponse(res, 'Protected profile data retrieved successfully!', { user: req.user });
});

// Kendra Dashboard route - Only accessible by users with role 1
router.get('/kendra-dashboard', verifyToken, verifyRole([1]), (req, res) => {
    return successResponse(res, 'Welcome to the Kendra Dashboard!');
});

module.exports = router;
