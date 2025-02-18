// logger.js
const winston = require('winston');

// Set up winston logger with file transport
const logger = winston.createLogger({
  level: 'info', // Set log level (info is the default)
  transports: [
    new winston.transports.File({ filename: 'activity_logs.log' }) // Logs will be saved in activity_logs.log
  ]
});

// Function to log activity
const logActivity = (logMessage) => {
  logger.info(logMessage);
};

module.exports = logActivity;
