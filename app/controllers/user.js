const jwt = require('jsonwebtoken');
const { userRegistrationSchema, userLoginSchema } = require('./vailidators/usersValidaters');
const { errorResponse, successResponse } = require('../utils/helper');
const { Users, jila, prant, vibhag, kshetra } = require('../models');

const JWT_SECRET = `${process.env.JWT_SECRET}`;

// User registration
exports.registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) return errorResponse(res, 'Validation failed', 400, error.details[0].message);

    const { user_name, full_name, email, mobile, password, user_type, user_type_id, level } = req.body;

    try {
        // Check if the username or mobile already exists
        const existingUser = await Users.findOne({ user_name });
        if (existingUser) {
            return errorResponse(res, 'User with this username already exists.', 400);
        }

        // Handle dynamic validation based on user_type and level
        let validationErrors = [];

        if (!user_type_id) validationErrors.push('user_type_id is required.');
        if (!level || level < 1 || level > 3) validationErrors.push('Invalid level.');

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

        // Check if the user is creating users in the appropriate context based on their level
        if (user_type === 'kendra' && level === 1) {
            // Kendra can create users of all levels
        } else if (user_type === 'kshetra') {
            if (level === 1) {
                // Level 1 of Kshetra cannot create any users
                validationErrors.push('Kshetra level 1 users cannot create any users.');
            } else if (level === 2) {
                
            }
        } else if (user_type === 'prant') {
            if (level === 1 || level === 2) {
                // Level 1 of Prant can only view users
                validationErrors.push('Prant level 1 & 2 users cannot create any users.');
            }  else if (level === 3) {
                // Level 3 of Prant can create users for all levels (vibhag, jila)
            }
        } else if (user_type === 'vibhag') {
            if (level === 1 || level === 2) {
                // Level 1 of Vibhag can only view users
                validationErrors.push('Vibhag level 1 & 2 users cannot create any users.');
            } else if (level === 3) {
                // Level 3 of Vibhag can create users for all levels (jila)
            }
        } else if (user_type === 'jila') {
            if (level === 1 || level === 2) {
                // Level 1 of Jila can only view users
                validationErrors.push('Jila level 1 & 2 users cannot create any users.');
            }
        }

        // If there are validation errors, respond with them
        if (validationErrors.length > 0) {
            return errorResponse(res, validationErrors.join(' '), 400);
        }

        // Create a new user object with the provided data
        const data = { user_name, full_name, email, mobile, password, user_type, user_type_id, level };

        // Create a new user
        const newUser = new Users(data);
        await newUser.save();

        successResponse(res, 'User created successfully!', { user_name, full_name, email, mobile, user_type, user_type_id, level }, 201);
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
        const token = jwt.sign({ id: user._id, user_type: user.user_type, user_type_id: user.user_type_id, level: user.level, }, JWT_SECRET, { expiresIn: `${process.env.TOKENEXPIRE}` });

        successResponse(res, `${user.user_type} LoggedIn successfully!`, { token, user_type: user.user_type, user_type_id: user.user_type_id, level: user.level, }, 200);

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
    const { user_name, full_name, email, mobile, password, user_type, user_type_id, level } = req.body;

    try {
        // Find the user by user_id      
        const user = await Users.findById(req.user.id);
        if (!user) {
            return errorResponse(res, 'User not found.', 404);
        }

        // Handle context-based updates based on user type and level
        let validationErrors = [];

        // Check user permissions based on their user_type and level
        if (user_type && user_type !== user.user_type) {
            // Users can only update their user_type if their level allows it.
            if (user.user_type === 'kendra' || (user.user_type === 'kshetra' && user.level === 2)) {
                // Kendra (level 1) and Kshetra (level 2) can update user_type, else restricted
                validationErrors.push('You cannot change user_type.');
            }
        }

        if (level) {
            // Ensure level is within the valid range
            if (level < 1 || level > 3) {
                validationErrors.push('Invalid level.');
            }

            // Level restrictions for updates
            if (user_type === 'kshetra') {
                if (level === 1) {
                    validationErrors.push('Kshetra level 1 users cannot change their level.');
                }
            } else if (user_type === 'prant') {
                if (level === 1 || level === 2) {
                    validationErrors.push('Prant level 1 & 2 users cannot change their level.');
                }
            } else if (user_type === 'vibhag') {
                if (level === 1 || level === 2) {
                    validationErrors.push('Vibhag level 1 & 2 users cannot change their level.');
                }
            } else if (user_type === 'jila') {
                if (level === 1 || level === 2) {
                    validationErrors.push('Jila level 1 & 2 users cannot change their level.');
                }
            }
        }

        // Validate if user_type_id is provided and validate it
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

        // Check if the user is trying to update fields that they are not allowed to
        if (validationErrors.length > 0) {
            return errorResponse(res, validationErrors.join(' '), 400);
        }

        // Handle optional fields: if provided, update the corresponding field
        if (user_name) user.user_name = user_name;
        if (full_name) user.full_name = full_name;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (level) user.level = level; // If allowed by level, update it.

        // If a new password is provided, update it and it will be hashed in the pre-save hook
        if (password) user.password = password;

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
            user_type_id: user.user_type_id,
            level: user.level
        }, 200);

    } catch (error) {
        console.error(error);
        errorResponse(res, 'An error occurred while updating the user.', 500, error.message);
    }
};
