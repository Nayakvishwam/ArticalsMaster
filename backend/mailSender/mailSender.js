const { decryptValue, getCurrentDate, applyReplacements } = require("../utils/utils");
const logger = require("../logger");
const { models } = require("../config/dbConnection");
const { sendEmail } = require("../services/MailSevices");
function blockSleep(ms) {
    const end = Date.now() + ms;
    while (Date.now() < end);
};

async function checkServiceActive() {
    let service = await models.services.findOne({
        attributes: ['is_active'],
        where: {
            name: 'email',
        },
        raw: true
    });
    return service?.is_active;
};
async function doWork(taskdata) {
    try {
        const taskId = taskdata.id;

        // Fetch the email task details from the database
        let task = await models.mailsmaster.findOne({
            where: { id: taskId },
            raw: true
        });

        if (!task) {
            logger.error(`Email task with ID ${taskId} not found.`);
            return;
        };
        task.smtp_password = process.env.SMTP_PASSWORD || null;
        // Decrypt sensitive information if necessary
        if (task.smtp_password) {
            task.smtp_password = decryptValue(task.smtp_password);
        };
        let sendContent = await models.emailTasks.findOne({
            where: {
                id: task.taskId
            },
            raw: true
        });
        if (sendContent) {
            sendContent.content = applyReplacements(sendContent.content, task.replaceContent);
        };
        // Prepare the mail configuration
        const mailConfig = {
            smtp: {
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: Number(process.env.SMTP_PORT) || 465,
                secure: Number(process.env.SMTP_PORT) === 465 || false, // Use true for port 465
                auth: {
                    user: process.env.emailFrom,
                    pass: task.smtp_password
                }
            },
            mail: {
                from: process.env.emailFrom,
                to: task.to,
                subject: task.subject,
                html: sendContent.content
            }
        };
        // Send the email using the sendEmail function
        const info = await sendEmail(mailConfig);

        // Log success and send response back to parent thread
        logger.info(`Email sent successfully for task ID ${taskId}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.log(error);
    }
};
async function mailSender() {
    try {
        while (true) {
            let isActive = await checkServiceActive();
            if (isActive) {
                let task = await models.mailsmaster.findOne({
                    where: { status: 'queued' },
                    raw: true,
                    order: [['id', 'ASC']]
                });
                if (task) {
                    let result = await doWork(task);
                    let date = getCurrentDate();
                    // Update email status based on delivery result
                    if (result?.accepted?.includes(task.to)) {
                        await models.mailsmaster.update(
                            {
                                sent_at: date,
                                status: 'sent'
                            },
                            { where: { id: task.id } }
                        );
                    } else {
                        await models.mailsmaster.update(
                            {
                                sent_at: date,
                                status: 'failed'
                            },
                            { where: { id: task.id } }
                        );
                    };
                }
            };
            blockSleep(15000);
        };
    } catch (error) {
        logger.error(`Running error: ${error}`);
    }
};

module.exports = {
    mailSender
};