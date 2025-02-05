require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection URI
const dbURI = process.env.MONGODB_URI; 

const connectDB = async () => {
    try {
        await mongoose.connect(`${ dbURI }`);
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process if DB connection fails
    }
};

module.exports = connectDB;
