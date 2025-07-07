const bcrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// You should store these securely (e.g., in environment variables)
const algorithm = 'aes-256-cbc';
const key = Buffer.from('0123456789abcdef0123456789abcdef', 'utf-8'); // 32 bytes
const iv = Buffer.from('abcdef9876543210', 'utf-8'); // 16 bytes
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
function decryptValue(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};
function encryptValue(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
function verifyToken(token) {
    try {
        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};
function applyReplacements(template, replacements) {
    let html = template;
    for (const key in replacements) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, replacements[key]);
    }
    return html;
};
function getCurrentDate() {
    return new Date();
};
module.exports = {
    PORT: 4000,
    hashPassword,
    getCurrentDate,
    decryptValue,
    applyReplacements,
    encryptValue,
    verifyToken
};