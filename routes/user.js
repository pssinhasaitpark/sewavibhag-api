const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/user');
const verifyToken = require('../middlewares/JWTMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
    // You can access the authenticated user through req.user
    res.json({ message: 'Protected profile data', user: req.user });
});

module.exports = router;
