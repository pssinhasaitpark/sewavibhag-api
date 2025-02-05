const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Optional: for password hashing

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,  // Removes extra spaces from the name
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensure no duplicate emails
        lowercase: true, // Convert email to lowercase before saving
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'], // Email validation
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password should be at least 6 characters long'],
    },
    // You can add additional fields as needed (e.g., profile picture, role, etc.)
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash the password before saving it to the database (if using bcryptjs)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip hashing if password isn't modified

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare entered password with stored hashed password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Create the model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
