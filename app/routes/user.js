const express = require('express');
const router = express.Router();
const { registerUser, loginUser, me, updateUser, find, createKendraUser, forgotPassword, resetPassword } = require('../controllers/user');
const { verifyToken, authenticate } = require('../middlewares/JWTMiddleware');
const activityLogMiddleware = require('../middlewares/activityLogMiddleware');

// Public routes
router.post('/register',authenticate,activityLogMiddleware, registerUser);
router.post('/createKendraUser',createKendraUser);
router.post('/login',activityLogMiddleware, loginUser);
router.get('/me',verifyToken, me);
router.get('/find',verifyToken, find);
router.patch('/update',verifyToken, updateUser);

// ForgotPassword route
router.post('/forgot/password',forgotPassword);

// Reset Password Route 
router.post('/reset-password', resetPassword);


module.exports = router;
