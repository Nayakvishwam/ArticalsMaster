const nodemailer = require('nodemailer'); // Import the nodemailer package
// 'mfpx rvnf kscq gmum'
/**
 * Create a dynamic transporter
 * This function initializes a nodemailer transporter using given SMTP configuration.
 * @param {Object} config - SMTP configuration
 * @param {string} config.host - SMTP server host (e.g., smtp.gmail.com)
 * @param {number} config.port - SMTP server port (e.g., 465 or 587)
 * @param {boolean} config.secure - Use TLS (true for 465, false for 587/25)
 * @param {string} config.user - SMTP user (usually an email address)
 * @param {string} config.pass - SMTP password or application-specific password
 */
function createTransporter(config) {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port == 465, // Automatically set secure true if using port 465
        auth: {
            user: config.auth.user,
            pass: config.auth.pass
        }
    });
}

/**
 * Send an email using the dynamically configured transporter.
 * @param {Object} mailConfig - Combined configuration for SMTP and mail content
 * @param {Object} mailConfig.smtp - SMTP configuration (used to create transporter)
 * @param {Object} mailConfig.mail - Mail details including sender, receiver, and content
 */
async function sendEmail(mailConfig) {
    // Create transporter instance using provided SMTP configuration
    const transporter = createTransporter(mailConfig.smtp);

    // Use the transporter to send the email
    const info = await transporter.sendMail({
        from: mailConfig.mail.from,      // Sender address
        to: mailConfig.mail.to,          // Recipient address(es), can be comma-separated
        subject: mailConfig.mail.subject, // Subject line of the email
        html: mailConfig.mail.html        // HTML body (optional, if needed)
    });
    // Return the result of the sendMail operation (includes messageId, response, etc.)
    return info;
}

// Export the sendEmail function so it can be used in other modules
module.exports = { sendEmail };