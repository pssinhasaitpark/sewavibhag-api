require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection URI
const dbURI = process.env.MONGODB_URI; 

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 10000, // Adjust timeout as needed
        });
        console.log('✅ MongoDB connected...');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
