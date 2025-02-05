const express = require('express');
const cors = require('cors');
const routes = require('./routes/index'); 
require('dotenv').config(); 

// Import the database connection function
const connectDB = require('./DB-Config/db-config'); 

const app = express();

// Middleware setup for CORS
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001", 
        ],
        methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
        optionsSuccessStatus: 200,
    })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use the routes defined in routes/index.js
app.use('/api', routes); 

// Default route (for testing or a simple greeting)
app.get('/', (req, res) => {
    res.send({
        message: 'Hello, World!',
        error: false,
    });
});

// Start the server and listen on a specified port (default: 5000)
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
