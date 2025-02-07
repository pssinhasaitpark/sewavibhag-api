const jwt = require('jsonwebtoken');
const { userRegistrationSchema, userLoginSchema } = require('./vailidators/usersValidaters');
const { errorResponse, successResponse } = require('../utils/helper');
const { Users } = require('../models');

const JWT_SECRET = `${process.env.JWT_SECRET}`;

// User registration
exports.registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) return errorResponse(res, 'Validation failed', 400, error.details[0].message);

    const { user_name, full_name, email, mobile, password, user_type } = req.body;

    try {
        // Check if the username or mobile already exists
        const existingUser = await Users.findOne({ user_name });

        if (existingUser) {
            return errorResponse(res, 'User with this username already exists.', 400);
        }

        const data = { user_name, full_name, email, mobile, password, user_type }

        const newUser = new Users(data);
        await newUser.save();

        successResponse(res, 'User created successfully!', { user_name, full_name, email, mobile, user_type }, 201);
    } catch (error) {
        console.error(error);
        errorResponse(res, error.message, 500,);
    }
};

// User login
exports.loginUser = async (req, res) => {
    const { error } = userLoginSchema.validate(req.body);

    if (error) return errorResponse(res, error.details[0].message, 400,);

    const { user_name, password } = req.body;

    try {
        const user = await Users.findOne({ user_name })

        console.log('VBVVV', user);

        if (!user) {
            return errorResponse(res, 'Invalid username or password.', 400);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid username or password.', 400);
        }

        // Generate JWT token
        const token = jwt.sign({ user_id: user._id, user_type: user.user_type }, JWT_SECRET, { expiresIn: '1h' });

        successResponse(res, `${user.user_type} LoggedIn successfully!`, { token, user_type: user.user_type }, 200);
        
    } catch (error) {
        console.error(error);
        errorResponse(res, 'An unexpected error occurred during login.', 500, error.message);
    }
};


