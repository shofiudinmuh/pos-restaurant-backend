const { body, param, query } = require('express-validator');
const { User } = require('../models');

exports.registerValidator = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be 3-100 characters')
        .trim()
        .custom(async (value) => {
            const user = await User.findOne({ where: { username: value } });
            if (user) throw new Error('Username is already exists');
            return true;
        }),
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .isLength({ max: 255 })
        .withMessage('Email must be at most 255 characters')
        .custom(async (value) => {
            const user = await User.findOne({ where: { email: value } });
            if (user) throw new Error('Email is already exists');
            return true;
        }),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body('google_id')
        .optional()
        .isString()
        .withMessage('Google ID must be a string')
        .isLength({ max: 255 })
        .withMessage('Google ID must be at most 255 characters')
        .custom(async (value) => {
            if (value) {
                const user = await User.findOne({ where: { google_id: value } });
                if (user) throw new Error('Google ID is already exists');
            }
            return true;
        }),
    body('role_id').isUUID().withMessage('Invalid role ID'),
    body('outlet_id')
        .isUUID()
        .withMessage('Invalid outlet ID')
        .custom(async (value) => {
            const outlet = await Outlet.findByPk(value);
            if (!outlet) throw new Error('Outlet is not found');
            return true;
        }),
];

exports.loginValidator = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be 3-100 characters')
        .notEmpty()
        .withMessage('Username id  required')
        .trim(),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .notEmpty()
        .withMessage('Password is required'),
];

exports.refreshTokenValidator = [
    body('refreshToken')
        .isString()
        .withMessage('Refresh token must be a string')
        .notEmpty()
        .withMessage('Refresh token is required'),
];
