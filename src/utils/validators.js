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
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
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

exports.paginationValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
        .toInt(),
    query('sort').optional().isIn(['asc', 'desc']).withMessage('Sort must be asc or desc'),
    query('sortBy').optional().isString().withMessage('sortBy must be a string').trim(),
];

exports.idParamValidator = [param('id').isUUID().withMessage('Invalid ID format')];

exports.outletValidator = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be 3-100 characters')
        .notEmpty()
        .withMessage('Name is required')
        .trim(),
    body('address')
        .isString()
        .withMessage('Address must be a string')
        .notEmpty()
        .withMessage('Address is required')
        .trim(),
    body('phone')
        .optional()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Invalid phone number format'),
    body('logo_url').optional().isURL().withMessage('Logo URL must be a valid URL'),
];
