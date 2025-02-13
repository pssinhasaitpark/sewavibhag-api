const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    user_type: {
        type: String,
        required: true,
        enum: ['kendra', 'kshetra', 'prant', 'vibhag', 'jila'],
        comment: 'kendra, kshetra, prant, vibhag, jila',
    },
    user_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    full_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    level: {
        type: Number,
        required: true,
        enum: [1, 2, 3],  // 1: Read-only, 2: Can create child users, 3: Can manage users
    },
},
    {
        timestamps: true,
    });

// Middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Ensure you're exporting the model correctly
const User = mongoose.model('User', userSchema);

module.exports = User;  