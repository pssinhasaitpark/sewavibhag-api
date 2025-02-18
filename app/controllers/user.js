const jwt = require('jsonwebtoken');
const logActivity = require('../utils/logger');
const { userRegistrationSchema, userLoginSchema } = require('./vailidators/usersValidaters');
const { errorResponse, successResponse } = require('../utils/helper');
const { Users, jila, kshetra, prant, vibhag } = require('../models');
const Prant = require('../models/prant');
const Vibhag = require('../models/vibhag');
const Kshetra = require('../models/kshetra');
const Jila = require('../models/jila');


const JWT_SECRET = `${process.env.JWT_SECRET}`;

// User registration
exports.registerUser = async (req, res) => {
    // Get user type and level from the token (req.user should be populated by your auth middleware)
    const { user_type: currentUserType, level: currentUserLevel } = req.user;

    // Validate incoming request data
    const { error } = userRegistrationSchema.validate(req.body);

    if (error) return errorResponse(res, error.details[0].message, 400,);

    const { user_name, full_name, email, mobile, password, user_type, user_type_id, level } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await Users.findOne({ user_name, email });
        if (existingUser) {
            return errorResponse(res, 'User with this username or email already exists.', 400);
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

        // Check if the user is creating users in the appropriate context based on their level and user type
        let allowedToCreateUser = false;

        // Handle the logic based on the current user's type and level
        if (currentUserType === user_type) {
            validationErrors.push('A user cannot create a user of the same type.');
        } else if (currentUserType === 'kendra' && currentUserLevel === 1) {
            // Kendra level 1 can create users of all types and levels
            allowedToCreateUser = true;
        } else if (currentUserType === 'kshetra') {
            if (currentUserLevel === 1) {
                // Kshetra level 1 cannot create any users
                validationErrors.push('Kshetra level 1 users cannot create any users.');
            } else if (currentUserLevel === 2) {
                // Kshetra level 2 can create users only for Kshetra or lower levels
                allowedToCreateUser = true;
            }
        } else if (currentUserType === 'prant') {
            if (currentUserLevel === 1 || currentUserLevel === 2) {
                // Prant level 1 & 2 can only view users
                validationErrors.push('Prant level 1 & 2 users cannot create any users.');
            } else if (currentUserLevel === 3) {
                // Prant level 3 can create users for all levels (vibhag, jila)
                allowedToCreateUser = true;
            }
        } else if (currentUserType === 'vibhag') {
            if (currentUserLevel === 1 || currentUserLevel === 2) {
                // Vibhag level 1 & 2 can only view users
                validationErrors.push('Vibhag level 1 & 2 users cannot create any users.');
            } else if (currentUserLevel === 3) {
                // Vibhag level 3 can create users for all levels (jila)
                allowedToCreateUser = true;
            }
        } else if (currentUserType === 'jila') {
            if (currentUserLevel === 1 || currentUserLevel === 2) {
                // Jila level 1 & 2 can only view users
                validationErrors.push('Jila level 1 & 2 users cannot create any users.');
            }
        }

        // Check if the current user is allowed to create a new user
        if (!allowedToCreateUser) {
            return errorResponse(res, 'You are not allowed to create users at your level.', 403);
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

        // Activity Logs
        const logMessage = {
            username: req.user.user_name,
            user_type: req.user.user_type,
            action: 'create_user',
            ip_address: req.ip || req.connection.remoteAddress,
            target_user: user_name,
            target_form: 'N/A',
            user_level: req.user.level,
            user_type_id: req.user.user_type_id,
            timestamp: new Date().toISOString(),
        };

        logActivity(logMessage);  // Log the activity

        // Success response
        successResponse(res, 'User created successfully!', { user_name, full_name, email, mobile, user_type, user_type_id, level }, 201);
    } catch (error) {
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
        const token = jwt.sign({ id: user._id, user_name: user.user_name, user_type: user.user_type, user_type_id: user.user_type_id, level: user.level, }, JWT_SECRET, { expiresIn: `${process.env.TOKENEXPIRE}` });

        // Activity log
        const ip_address = req.ip || req.connection.remoteAddress;
        const logMessage = {
            username: user.user_name,
            user_type: user.user_type,
            user_level: user.level,
            user_type_id: user.user_type_id,
            action: 'login',
            ip_address: ip_address,
            target_user: 'N/A',
            target_form: 'N/A',
            timestamp: new Date().toISOString()
        };

        logActivity(logMessage);  // Log the login activity

        successResponse(res, `${user.user_type} LoggedIn successfully!`, { token, user_name: user.user_name, user_type: user.user_type, user_type_id: user.user_type_id, level: user.level, }, 200);

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

        // Initialize a response object to store user and associated data
        let userDetails = { user };

        // Handle different user types and perform lookups accordingly
        if (user.user_type === "jila") {
            // If user is a Jila, look up Kshetra, Prant, and Vibhag details
            const jilaData = await jila.aggregate([
                {
                    $match: { _id: user.user_type_id },
                },
                {
                    $lookup: {
                        from: "kshetras",
                        localField: "kshetra_id",
                        foreignField: "_id",
                        as: "kshetra",
                    },
                },
                {
                    $lookup: {
                        from: "prants",
                        localField: "prant_id",
                        foreignField: "_id",
                        as: "prant",
                    },
                },
                {
                    $lookup: {
                        from: "vibhags",
                        localField: "vibhag_id",
                        foreignField: "_id",
                        as: "vibhag",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        kshetra_name: { $arrayElemAt: ["$kshetra.kshetra_name", 0] },
                        prant_name: { $arrayElemAt: ["$prant.prant_name", 0] },
                        vibhag_name: { $arrayElemAt: ["$vibhag.vibhag_name", 0] },
                        jila_name: 1,

                    },
                },
            ]);

            if (jilaData.length > 0) {
                userDetails = { ...userDetails, ...jilaData[0] };
            }
        } else if (user.user_type === "vibhag") {
            const vibhagData = await vibhag.aggregate([
                {
                    $match: { _id: user.user_type_id },
                },
                {
                    $lookup: {
                        from: "jilas",
                        localField: "_id",
                        foreignField: "vibhag_id",
                        as: "jilas",
                    },
                },
                {
                    $lookup: {
                        from: "kshetras",
                        localField: "kshetra_id",
                        foreignField: "_id",
                        as: "kshetra",
                    },
                },
                {
                    $lookup: {
                        from: "prants",
                        localField: "prant_id",
                        foreignField: "_id",
                        as: "prant",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        vibhag_name: 1,
                        kshetra_name: { $arrayElemAt: ["$kshetra.kshetra_name", 0] },
                        prant_name: { $arrayElemAt: ["$prant.prant_name", 0] },
                        total_jilas: { $size: "$jilas" },
                    },
                },
            ]);

            if (vibhagData.length > 0) {
                userDetails = { ...userDetails, ...vibhagData[0] };
            }

        } else if (user.user_type === "prant") {
            const prantData = await prant.aggregate([
                {
                    $match: { _id: user.user_type_id },
                },
                {
                    $lookup: {
                        from: "vibhags",
                        localField: "_id",
                        foreignField: "prant_id",
                        as: "vibhags",
                    },
                },
                {
                    $lookup: {
                        from: "jilas",
                        localField: "_id",
                        foreignField: "prant_id",
                        as: "jilas",
                    },
                },
                {
                    $lookup: {
                        from: "kshetras",
                        localField: "kshetra_id",
                        foreignField: "_id",
                        as: "kshetra",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        prant_name: 1,
                        kshetra_name: { $arrayElemAt: ["$kshetra.kshetra_name", 0] },
                        total_vibhags: { $size: "$vibhags" },
                        total_jilas: { $size: "$jilas" },
                    },
                },
            ]);

            if (prantData.length > 0) {
                userDetails = { ...userDetails, ...prantData[0] };
            }

        } else if (user.user_type === "kshetra") {
            const kshetraData = await kshetra.aggregate([
                {
                    $match: { _id: user.user_type_id },
                },
                {
                    $lookup: {
                        from: "prants",
                        localField: "_id",
                        foreignField: "kshetra_id",
                        as: "prants",
                    },
                },
                {
                    $lookup: {
                        from: "vibhags",
                        localField: "_id",
                        foreignField: "kshetra_id",
                        as: "vibhags",
                    },
                },
                {
                    $lookup: {
                        from: "jilas",
                        localField: "_id",
                        foreignField: "kshetra_id",
                        as: "jilas",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        kshetra_name: 1,
                        total_prants: { $size: "$prants" },
                        total_vibhags: { $size: "$vibhags" },
                        total_jilas: { $size: "$jilas" },
                    },
                },
            ]);

            if (kshetraData.length > 0) {
                userDetails = { ...userDetails, ...kshetraData[0] };
            }

        } else if (user.user_type === "kendra") {
            const kendraData = await kendra.aggregate([
                {
                    $lookup: {
                        from: "kshetras",
                        localField: "_id",
                        foreignField: "kendra_id",
                        as: "kshetras",
                    },
                },
                {
                    $lookup: {
                        from: "prants",
                        localField: "_id",
                        foreignField: "kendra_id",
                        as: "prants",
                    },
                },
                {
                    $lookup: {
                        from: "vibhags",
                        localField: "_id",
                        foreignField: "kendra_id",
                        as: "vibhags",
                    },
                },
                {
                    $lookup: {
                        from: "jilas",
                        localField: "_id",
                        foreignField: "kendra_id",
                        as: "jilas",
                    },
                },
                {
                    $project: {
                        _id: 0,
                        kendra_name: "Akhil Bhartiya",
                        total_kshetras: { $size: "$kshetras" },
                        total_prants: { $size: "$prants" },
                        total_vibhags: { $size: "$vibhags" },
                        total_jilas: { $size: "$jilas" },
                    },
                },
            ]);

            if (kendraData.length > 0) {
                userDetails = { ...userDetails, ...kendraData[0] };
            }
        }

        // Return the combined user details and associated data
        successResponse(res, "User details retrieved successfully!", userDetails, 200);

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
        if (level) user.level = level;

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

exports.find = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        // Fetch logged-in user details
        const loggedInUser = await Users.findById(req.user.id);

        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initialize the query object
        let query = { user_type: { $in: [] } };

        // Depending on the user_type of logged-in user, modify the query to filter by user_type
        switch (loggedInUser.user_type) {
            case 'jila':
                query.user_type.$in = ['jila'];
                break;
            case 'vibhag':
                query.user_type.$in = ['vibhag', 'jila'];
                break;
            case 'prant':
                query.user_type.$in = ['prant', 'vibhag', 'jila'];
                break;
            case 'kshetra':
                query.user_type.$in = ['kshetra', 'prant', 'vibhag', 'jila'];
                break;
            case 'kendra':
                query.user_type.$in = ['kendra', 'kshetra', 'prant', 'vibhag', 'jila'];
                break;
            default:
                return res.status(400).json({ message: "Invalid user type" });
        }

        // Fetch users based on the query and their associated details (user_name, full_name, email, mobile, etc.)
        const users = await Users.find(query).select('user_name full_name email mobile user_type_id level user_type ');

        // Now, we need to get the particular names of Kshetra, Prant, Vibhag, Jila users.
        const populatedUsers = await Promise.all(users.map(async (user) => {
            let additionalData = {};

            // Based on user_type, fetch relevant data

            switch (user.user_type) {
                case 'kshetra':
                    const kshetra = await Kshetra.findById(user.user_type_id).select('kshetra_name');
                    additionalData.kshetra_name = kshetra ? kshetra.kshetra_name : 'Not available';
                    break;
                case 'prant':
                    const prant = await Prant.findById(user.user_type_id).select('prant_name');
                    additionalData.prant_name = prant ? prant.prant_name : 'Not available';
                    break;
                case 'vibhag':
                    const vibhag = await Vibhag.findById(user.user_type_id).select('vibhag_name');
                    additionalData.vibhag_name = vibhag ? vibhag.vibhag_name : 'Not available';
                    break;
                case 'jila':
                    const jila = await Jila.findById(user.user_type_id).select('jila_name');
                    additionalData.jila_name = jila ? jila.jila_name : 'Not available';
                    break;
                case 'kendra':
                    additionalData.kendra_name = 'Akhil Bhartiya';
                    break;
                default:
                    break;
            }

            return { ...user.toObject(), ...additionalData };  // Merge user details with the particular name
        }));

        // Return the populated user details
        res.status(200).json({
            message: "Users fetched successfully",
            data: populatedUsers
        });

    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
