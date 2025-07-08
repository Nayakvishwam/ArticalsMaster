const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();  // Loads environment variables from .env file
var cors = require('cors');
const { PORT } = require('./utils/utils');
const { worker } = require('./mailSender/mailWorker');
const logger = require('./logger');
const { allRoutes } = require('./routes/routes');
const app = express();
(async () => {

    worker.on('message', async () => {
        return true
    });

    // Handle worker thread errors
    worker.on('error', (err) => {
        logger.error(`Worker error: ${err}`);
        return false

    });

    // Log if the worker exits unexpectedly
    worker.on('exit', (code) => {
        if (code !== 0) {
            logger.error(`Worker exited with code ${code}`);
        }
    });
})();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true); // Allow all origins
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
};
app.use(cors(corsOptions));
app.use('/', allRoutes);
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});