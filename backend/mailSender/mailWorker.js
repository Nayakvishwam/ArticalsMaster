const { Worker } = require('worker_threads');

const worker = new Worker("./mailSender/mailHandler.js", {
    workerData: {
        start: true
    }
});

module.exports = {
    worker
};