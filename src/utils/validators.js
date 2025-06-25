const { body, param, query } = require('express-validator');
const { User, Outlet } = require('../models');

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

exports.menuCategoryValidator = [
    body('outlet_id')
        .isUUID()
        .withMessage('Invalid outlet ID')
        .custom(async (value) => {
            const outlet = await Outlet.findByPk(value);
            if (!outlet) throw new Error('Outlet not found');
            return true;
        }),
    body('category_name')
        .isString()
        .withMessage('Category name must be a string')
        .isLength({ min: 3, max: 50 })
        .withMessage('Category name must be 3-50 characters')
        .notEmpty()
        .withMessage('Categori name is required')
        .trim(),
    body('description').isString().withMessage('Description must be a string').optional(),
];

exports.menuItemValidator = [
    body('outlet_id')
        .isUUID()
        .withMessage('Invalid outlet ID')
        .custom(async (value) => {
            const outlet = await Outlet.findByPk(value);
            if (!outlet) throw new Error('Outlet not found');
            return true;
        }),
    body('category_id')
        .isUUID()
        .withMessage('Invalid category Id')
        .custom(async (value) => {
            const category = await MenuCategories.findByPk(value);
            if (!category) throw new Error('Category not found');
            return true;
        }),
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be 3-100 characters')
        .notEmpty()
        .withMessage('Name is required')
        .trim(),
    body('description').isString().withMessage('Description must be a string').optional(),
    body('price')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('Price must be a valid decimal number with up to 2 decimal places')
        .notEmpty()
        .withMessage('Price is required'),
    body('photo_url').optional().isURL().withMessage('Photo URL must be a valid URL'),
    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean value')
        .default(true),
];

exports.ingredientValidator = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be 3 - 100 characters')
        .notEmpty()
        .withMessage('Name is required')
        .trim(),
    body('unit')
        .isString()
        .withMessage('Unit must be a string')
        .notEmpty()
        .withMessage('Unit is required'),
    body('minimum_stock')
        .isDecimal()
        .withMessage('Minimum stock must be a number')
        .notEmpty()
        .withMessage('Minimum stock is required'),
];

exports.updateIngredientValidator = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be 3 - 100 characters')
        .trim(),
    body('unit').optional().isString().withMessage('Unit must be a string'),
    body('minimum_stock').optional().isDecimal().withMessage('Minimum stock must be a number'),
];

exports.menuIngredientValidator = [
    body('menu_id').isUUID().notEmpty().withMessage('Menu item is required'),
    body('ingredient_id').isUUID().notEmpty().withMessage('Ingredient is required'),
    body('quantity')
        .isDecimal()
        .withMessage('Quantity must be number')
        .notEmpty()
        .withMessage('Quantity is required'),
];

exports.updateMenuIngredientValidator = [
    body('menu_id').isUUID().optional(),
    body('ingredient_id').optional().isUUID(),
    body('quantity').optional().isDecimal().withMessage('Quantity must be number'),
];

exports.createInventoryTransactionValidator = [
    body('ingredient_id').isUUID().notEmpty().withMessage('Ingredient is required'),
    body('transaction_type').isString(20).notEmpty().withMessage('Transaction type is required'),
    body('quantity')
        .isDecimal()
        .withMessage('Quantity must be numeric')
        .notEmpty()
        .withMessage('Quantity is required'),
    body('reason').isString(255).withMessage('Reason must be a string'),
];
