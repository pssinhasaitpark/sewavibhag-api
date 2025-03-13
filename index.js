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
    origin: ["http://localhost:3000", "http://localhost:3001", 'https://sewavibhag-client.pages.dev', 'https://sewavibhage.netlify.app', 'https://sewavibhag.netlify.app'
        ,'http://192.168.0.123:3000','http://192.168.0.114:3000','http://192.168.0.114:3001','https://sewavibhag.main.parkhya.org',
        'http://localhost:5174', 
        'http://192.168.0.123:5174',
        'http://192.168.0.123:5173',
    ],
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

// Use Morgan for logging
app.use(morgan('dev'));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default route (for testing or a simple greeting)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello, World!', error: false });
});

// Render the report form
app.get('/report-form', (req, res) => {
    res.render('reportingForm'); // This will render the reportingForm.ejs template
});

// API Routes
app.use('/api/v1', routes); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Create HTTP Server

const port = process.env.PORT || 5000;

app.listen(port,  () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
