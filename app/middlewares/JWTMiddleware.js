const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Authorization: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Store decoded user info in the request object
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

exports.verifyRole = (requiredRoles) => {
    return (req, res, next) => {
        // Extract the JWT token from the Authorization header
        const token = req.header('Authorization')?.split(' ')[1]; // Authorization: Bearer <token>

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded; // Attach decoded user info to request

            // Check if the user has one of the required roles
            const hasRole = req.user.user_type.some(role => requiredRoles.includes(role));
            if (!hasRole) {
                return res.status(403).json({ message: 'Forbidden. You do not have the required role.' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            return res.status(400).json({ message: 'Invalid token.' });
        }
    };
};


