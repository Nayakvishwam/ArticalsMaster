// validators/userValidator.js
const { body } = require('express-validator');
const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
];

const registerUserValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user')
];

module.exports = {
    loginValidation,
    registerUserValidator
};
