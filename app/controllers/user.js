const jwt = require('jsonwebtoken');
const { userRegistrationSchema, userLoginSchema } = require('./vailidators/usersValidaters');
const { errorResponse, successResponse } = require('../utils/helper');
const { Users, jila, prant, vibhag, kshetra } = require('../models');

const JWT_SECRET = `${process.env.JWT_SECRET}`;

// User registration
exports.registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) return errorResponse(res, 'Validation failed', 400, error.details[0].message);

    const { user_name, full_name, email, mobile, password, user_type, user_type_id } = req.body;

    try {
        // Check if the username or mobile already exists
        const existingUser = await Users.findOne({ user_name });
        if (existingUser) {
            return errorResponse(res, 'User with this username already exists.', 400);
        }

        // Handle dynamic validation based on user_type
        let validationErrors = [];

        if (!user_type_id) validationErrors.push('user_type_id is required.');

        // Validate if the user_type_id exists in the respective collection
        if (user_type === 'prant') {
            const prantExists = await prant.findById(user_type_id);
            if (!prantExists) {
                return errorResponse(res, 'Invalid prant_id.', 400);
            }
        } else if (user_type === 'vibhag') {
            const vibhagExists = await vibhag.findById(user_type_id);
            if (!vibhagExists) {
                return errorResponse(res, 'Invalid vibhag_id.', 400);
            }
        } else if (user_type === 'jila') {
            const jilaExists = await jila.findById(user_type_id);
            if (!jilaExists) {
                return errorResponse(res, 'Invalid jila_id.', 400);
            }
        } else if (user_type === 'kshetra') {
            const kshetraExists = await kshetra.findById(user_type_id);
            if (!kshetraExists) {
                return errorResponse(res, 'Invalid kshetra_id.', 400);
            }
        }

        // Create a new user object with the provided data
        const data = { user_name, full_name, email, mobile, password, user_type, user_type_id };

        // Create a new user
        const newUser = new Users(data);
        await newUser.save();

        successResponse(res, 'User created successfully!', { user_name, full_name, email, mobile, user_type, user_type_id }, 201);
    } catch (error) {
        console.error(error);
        errorResponse(res, error.message, 500);
    }
};

// User login
exports.loginUser = async (req, res) => {
    const { error } = userLoginSchema.validate(req.body);

    if (error) return errorResponse(res, error.details[0].message, 400,);

    const { user_name, password } = req.body;

    try {
        const user = await Users.findOne({ user_name })

        if (!user) {
            return errorResponse(res, 'Invalid username or password.', 400);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid username or password.', 400);
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, user_type: user.user_type, user_type_id: user.user_type_id }, JWT_SECRET, { expiresIn: '1h' });

        successResponse(res, `${user.user_type} LoggedIn successfully!`, { token, user_type: user.user_type, user_type_id: user.user_type_id }, 200);

    } catch (error) {
        errorResponse(res, 'An unexpected error occurred during login.', 500, error.message);
    }
};

exports.me = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return errorResponse(res, "Unauthorized user", 401);
        }

        // Fetch user details
        const user = await Users.findOne({ _id: req.user.id });

        // Handle case where user is not found
        if (!user) {
            return errorResponse(res, "User not found", 404);
        }
        // If user is found, send the user details
        successResponse(res, "User details retrieved successfully!", { user }, 200);

    } catch (error) {
        // Handle unexpected errors and log for debugging
        console.error("Error retrieving user profile:", error);
        return errorResponse(res, "Internal server error", 500, error.message);
    }
};


exports.updateUser = async (req, res) => {
    const { user_id, user_name, full_name, email, mobile, password, user_type, user_type_id } = req.body;

    // Ensure user_id is present
    if (!user_id) {
        return errorResponse(res, 'Missing required field: user_id', 400);
    }

    try {
        // Find the user by user_id
        const user = await Users.findById(user_id);
        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        // Handle optional fields: if provided, update the corresponding field
        if (user_name) user.user_name = user_name;
        if (full_name) user.full_name = full_name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;

        // If a new password is provided, update it and it will be hashed in the pre-save hook
        if (password) user.password = password;

        // If user_type_id is provided, validate and update it based on user_type
        if (user_type_id) {
            let isValidUserTypeId = false;

            // Check based on the current user type
            if (user_type === 'prant') {
                isValidUserTypeId = await prant.findById(user_type_id);
            } else if (user_type === 'vibhag') {
                isValidUserTypeId = await vibhag.findById(user_type_id);
            } else if (user_type === 'jila') {
                isValidUserTypeId = await jila.findById(user_type_id);
            } else if (user_type === 'kshetra') {
                isValidUserTypeId = await kshetra.findById(user_type_id);
            }

            if (!isValidUserTypeId) {
                return errorResponse(res, 'Invalid user_type_id.', 400);
            }

            // Update the user_type_id
            user.user_type_id = user_type_id;
        }

        // If user_type is provided, update it
        if (user_type) {
            // Ensure user_type is valid
            const validUserTypes = ['kendra', 'kshetra', 'prant', 'vibhag', 'jila'];
            if (!validUserTypes.includes(user_type)) {
                return errorResponse(res, 'Invalid user_type.', 400);
            }

            user.user_type = user_type;
        }

        // Save the updated user details
        await user.save();

        // Return success response with updated user data
        successResponse(res, 'User updated successfully!', {
            user_name: user.user_name,
            full_name: user.full_name,
            email: user.email,
            mobile: user.mobile,
            user_type: user.user_type,
            user_type_id: user.user_type_id
        }, 200);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'An error occurred while updating the user.', 500, error.message);
    }
};