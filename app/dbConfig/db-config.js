require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection URI
const dbURI = process.env.MONGODB_URI; 

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected...');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
