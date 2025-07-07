const winston = require('winston');

// Configure the logger
const logger = winston.createLogger({
    level: 'info', // Log level (debug, info, warn, error)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        // Write logs to a file
        new winston.transports.File({ filename: 'logs/app.log', level: 'info' }),

        // Also log to the console (in development mode)
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

module.exports = logger;