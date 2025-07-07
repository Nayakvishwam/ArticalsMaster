const { workerData, parentPort } = require('worker_threads');
const { mailSender } = require('./mailSender');

async function doWork() {
    await mailSender();
};
doWork(workerData);