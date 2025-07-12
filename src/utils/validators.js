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

exports.updateOutletValidator = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be 3-100 characters')
        .trim(),
    body('address').optional().isString().withMessage('Address must be a string').trim(),
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

exports.createTableCategoryValidator = [
    body('category_name').isString().notEmpty().withMessage('Category name is required').trim(),
    body('description').isString().optional(),
];

exports.updateTableCategory = [
    body('category_name').optional().isString().trim(),
    body('description').optional().isString(),
];

exports.createTableValidator = [
    body('table_number')
        .isNumeric()
        .withMessage('Table number must be a numeric')
        .notEmpty()
        .withMessage('Table number is required'),
    body('capacity')
        .isNumeric()
        .withMessage('Capacity must be a numeric')
        .notEmpty()
        .withMessage('Capacity is required'),
    body('table_category_id').isUUID().notEmpty().withMessage('Table category is required'),
    body('status').isString().notEmpty().withMessage('Table status is required'),
];

exports.updateTableValidator = [
    body('table_number').optional().isNumeric().withMessage('Table number must be a numeric'),
    body('capacity').optional().isNumeric().withMessage('Capacity must be a numeric'),
    body('table_category_id').optional().isUUID(),
    body('status').optional().isString(),
];

exports.createDiscountsValidator = [
    body('name')
        .isString()
        .withMessage('Discount name must be a string')
        .notEmpty()
        .withMessage('Discount name is required'),
    body('type').isString().notEmpty().withMessage('Discount type is required'),
    body('value')
        .isNumeric()
        .withMessage('Discount value must be a numeric')
        .notEmpty()
        .withMessage('Discount value is required'),
    body('is_member_only').isBoolean().notEmpty().withMessage('Customer target is required'),
    body('start_date')
        .isDate()
        .withMessage('Start date must be a valid date')
        .notEmpty()
        .withMessage('Start date is required'),
    body('end_date')
        .isDate()
        .withMessage('End date must be a valid date')
        .notEmpty()
        .withMessage('End date is required'),
];

exports.updateDiscountsValidator = [
    body('name').isString().withMessage('Discount name must be a string').optional(),
    body('type').isString().optional(),
    body('value').isNumeric().withMessage('Discount value must be a numeric').optional(),
    body('is_member_only').isBoolean().optional(),
    body('start_date').isDate().withMessage('Start date must be a valid date').optional(),
    body('end_date').isDate().withMessage('End date must be a valid date').optional(),
];

exports.createTaxesValidator = [
    body('name')
        .isString()
        .withMessage('Tax name must be a string')
        .notEmpty()
        .withMessage('Tax name is required'),
    body('rate')
        .isNumeric()
        .withMessage('Tax rate must be a number')
        .notEmpty()
        .withMessage('Tax rate is required'),
    body('is_active').isBoolean().notEmpty().withMessage('Tax status is required'),
];

exports.updateTaxesValidator = [
    body('name').optional().isString().withMessage('Tax name must be a string'),
    body('rate').optional().isNumeric().withMessage('Tax rate must be a number'),
    body('is_active').optional().isBoolean(),
];

exports.createLoyaltyRewardsValidator = [
    body('name')
        .isString()
        .withMessage('Name must be a characters')
        .notEmpty()
        .withMessage('Name is required'),
    body('description').isString().optional(),
    body('point_required')
        .isNumeric()
        .withMessage('Point minimum must be a number')
        .notEmpty()
        .withMessage('Point minimum is required'),
    body('reward_type').isString().notEmpty().withMessage('Reward type is required'),
    body('value')
        .isNumeric()
        .withMessage('Value must be a number')
        .notEmpty()
        .withMessage('Value is required'),
    body('menu_id').isUUID().notEmpty().withMessage('Menu is required'),
    body('is_active').isBoolean().notEmpty().withMessage('Loyalty status is required'),
];

exports.updateLoyaltyRewardsValidator = [
    body('name').isString().withMessage('Name must be a characters').optional(),
    body('description').isString().optional(),
    body('point_required').isNumeric().withMessage('Point minimum must be a number').optional(),
    body('reward_type').isString().optional(),
    body('value').isNumeric().withMessage('Value must be a number').optional(),
    body('menu_id').isUUID().optional(),
    body('is_active').isBoolean().optional(),
];

exports.createCustomerValidator = [
    body('name')
        .isString()
        .withMessage('Name must be a characters')
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Email must be valid format')
        .notEmpty()
        .withMessage('Email is required'),
    body('phone')
        .isNumeric()
        .withMessage('Phone must be number')
        .notEmpty()
        .withMessage('Phone number is required'),
    body('address')
        .isString()
        .withMessage('Address must be characters')
        .notEmpty()
        .withMessage('Address is required'),
    body('membership_status')
        .isString()
        .withMessage('Membership status must be a valid option')
        .notEmpty()
        .withMessage('Membership status is required'),
    body('membership_start_date')
        .isDate()
        .withMessage('Membership start date must be a valid date')
        .notEmpty()
        .withMessage('Membership date is required'),
];

exports.updateCustomerValidator = [
    body('name').isString().optional(),
    body('email').isEmail().withMessage('Email must be valid format').optional(),
    body('phone').isString().optional(),
    body('address').isString().optional(),
    body('membership_status').isString().optional(),
    body('membership_start_date').isDate().optional(),
];

exports.createOrderValidator = [
    body('table_id').isUUID().optional(),
    body('customer_id').optional().isUUID(),
    body('discount_id').optional().isUUID(),
    body('order_type').optional().isString(),
    body('items').isArray({ min: 1 }),
    body('items.*.menu_id').isUUID(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.notes').optional().isString().trim(),
];

exports.cancelOrderValidator = [
    body('password').isString().notEmpty().withMessage('Password is required'),
    body('notes').isString().notEmpty().withMessage('Notes is required to cancel order'),
];

exports.createPaymentValidator = [
    body('amount').isFloat({ min: 0 }).notEmpty().withMessage('Amount must be positive value'),
    body('payment_method')
        .isIn(['cash', 'credit_cart', 'debit_card', 'ewallet'])
        .withMessage('Invalid payment method'),
    body('splits').isArray({ min: 1 }).optional(),
    body('splits.*.amount').isFloat({ min: 0 }),
    body('splits.*.payment_id').isUUID(),
    body('redeem_reward_id').isUUID().optional(),
    body('discounts_id').isUUID().optional(),
];

exports.createRefundValidator = [
    body('payment_id').isUUID().notEmpty().withMessage('Payment ID is required'),
    body('reason').isString().notEmpty().withMessage('Reason is required'),
];
