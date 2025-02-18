const express = require('express');
const router = express.Router();
const { registerUser, loginUser, me, updateUser, find } = require('../controllers/user');
const { verifyToken, verifyRole, authenticate } = require('../middlewares/JWTMiddleware');
const { successResponse } = require('../utils/helper');

// Public routes
router.post('/register',authenticate, registerUser);
router.post('/login', loginUser);
router.get('/me',verifyToken, me);
router.get('/find',verifyToken, find);
router.patch('/update',verifyToken, updateUser);

module.exports = router;
