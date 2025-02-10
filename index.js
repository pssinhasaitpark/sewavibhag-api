const express = require('express');
const cors = require('cors');
const routes = require('./app/routes/index');
const connectDB = require('./app/dbConfig/db-config');
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware setup for CORS
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", 'https://sewavibhag-client.pages.dev'],
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

// Use Morgan for logging
app.use(morgan('dev'));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use the routes defined in routes/index.js
app.use('/api/v1', routes);

// Default route (for testing or a simple greeting)
app.get('/', (req, res) => {
    res.send({
        message: 'Hello, World!',
        error: false,
    });
});

// Render the report form
app.get('/report-form', (req, res) => {
    res.render('reportingForm'); // This will render the reportingForm.ejs template
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server and listen on a specified port (default: 5000)
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
