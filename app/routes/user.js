const express = require('express');
const router = express.Router();
const { registerUser, loginUser, me, updateUser, find } = require('../controllers/user');
const { verifyToken, authenticate } = require('../middlewares/JWTMiddleware');
const activityLogMiddleware = require('../middlewares/activityLogMiddleware');

// Public routes
router.post('/register',authenticate,activityLogMiddleware, registerUser);
router.post('/login',activityLogMiddleware, loginUser);
router.get('/me',verifyToken, me);
router.get('/find',verifyToken, find);
router.patch('/update',verifyToken, updateUser);

module.exports = router;
