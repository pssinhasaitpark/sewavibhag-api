const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { userRegistrationSchema, userLoginSchema } = require('../middlewares/usersValidaters');

// JWT secret key (in real life, store it securely in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET;

// User registration
const registerUser = async (req, res) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { user_name, full_name, mobile, password, user_type } = req.body;

    try {
        // Check if the username or mobile already exists
        const existingUser = await User.findOne({ $or: [{ user_name }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this username or mobile already exists.' });
        }

        const newUser = new User({
            user_name,
            full_name,
            mobile,
            password,
            user_type,
        });

        await newUser.save();
        res.status(201).json({
            message: 'User created successfully!',
            user: { user_name, full_name, mobile, user_type },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// User login
const loginUser = async (req, res) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { user_name, password } = req.body;

    try {
        const user = await User.findOne({ user_name });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login successful!',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { registerUser, loginUser };
