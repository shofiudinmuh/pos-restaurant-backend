const { body } = require('express-validator');
const {
    User,
    Outlet,
    Customer,
    Discount,
    Expenses,
    Ingredient,
    InventoryTransaction,
    Inventory,
    LoyaltyReward,
    LoyaltyTransaction,
    MenuIngredient,
    MenuItem,
    MenuCategories,
    OrderItem,
    Order,
    OrderTax,
    Payment,
    PaymentSplit,
    Refund,
    Shift,
    TableCategory,
    Table,
    Taxes,
} = require('../../models');
/**
 * Base class for validation logic, providing reusable validation method
 */
class BaseValidator {
    /**
     * Validate that a string is not empty and trimmed
     * @param {string} field - Field name
     * @param {string} [message] - Custom error message
     * @returns {Object} - Express-validator chain
     */
    static validateString(field, message = `${field} must be a string`) {
        return body(field)
            .isString()
            .withMessage(message)
            .notEmpty()
            .withMessage(`${field} is required`)
            .trim();
    }

    /**
     * Validate an optional string field with trimming
     * @param {string} field - Field name
     * @param {string} [message]
     * @returns {Object} - Express validator chain
     */
    static validateOptionalString(field, message = `${field} must be a string`) {
        return body(field).optional().isString().withMessage(message).trim();
    }

    /**
     * Validate a UUID field
     * @param {string} field -Field name
     * @param {boolean} [required = true] - Wheter the field is required
     * @returns {Object} -Express-validator chain
     */
    static validateUUID(field, required = true) {
        const validator = body(field).isUUID().withMessage(`${field} must be UUID`);
        return required
            ? validator.notEmpty().withMessage(`${field} is required`)
            : validator.optional();
    }

    /**
     * Validate optional UUID field
     * @param {string} field - UUID field
     * @param {string} [message] - Custom error message
     * @returns {Object} - Express validator chain
     */
    static validateOptionalUUID(field, message = `${field} must be a valid UUID`) {
        return body(field).optional().isUUID().withMessage(message);
    }

    /**
     * Validate a numeric field
     * @param {string} field - Field name
     * @param {boolean} [required = true] wheter the field is required
     * @returns {Object} - Express-validator chain
     */
    static validateNumeric(field, required = true) {
        const validator = body(field).isNumeric().withMessage(`${field} must be numeric value`);
        return required
            ? validator.notEmpty().withMessage(`${field} is required`)
            : validator.optional();
    }

    /**
     * Validate optional numeric field
     * @param {string} field - field name
     * @param {string} [message] - Custom error message
     * @returns {Object} -Express validator chain
     */
    static validateOptionalNumeric(field, message = `${field} must be numeric value`) {
        return body(field).optional().isNumeric().withMessage(message);
    }

    /**
     * Validate a decimal field
     * @param {string} field - Field name
     * @param {boolean} [required = true] wheter the field is required
     * @returns {Object} - Express validator chain
     */
    static validateDecimal(field, required = true) {
        const validator = body(field)
            .isDecimal({ decimal_digits: '0,2' })
            .withMessage(`${field} must be a decimal value up to 2 decimal place`);
        return required
            ? validator.notEmpty().withMessage(`${field} is required`)
            : validator.optional();
    }

    /**
     * Validate optional decimal field
     * @param {string} field - Field name
     * @param {string} [message] - Custom error message
     * @returns {Object} - Express validator chain
     */
    static validateOptionalDecimal(field, message = `${field} must be a decimal value`) {
        return body(field).optional().isDecimal().withMessage(message);
    }

    /**
     * Validate a float field
     * @param {string} field - Field name
     * @param {boolean} [required = true]
     * @returns {Object} - Express validator chain
     */
    static validateFloat(field, required = true) {
        const validator = body(field)
            .isFloat({ min: 0 })
            .withMessage(`${field} must be a non-negative number`);
        return required
            ? validator.notEmpty().withMessage(`${field} is required`)
            : validator.optional();
    }

    /**
     * Validate optional float field
     * @param {string} field
     * @param {string} [message]
     * @returns {Object}
     */
    static validateOptionalFloat(field, message = `${field} must be a non negative number`) {
        return body(field).optional().isFloat().withMessage(message);
    }

    /**
     * Validate a boolean field
     * @param {string} field - Field name
     * @param {boolean} [required = true]
     * @returns {Object} - Express validator chain
     */
    static validateBoolean(field, required = true) {
        const validator = body(field).isBoolean().withMessage(`${field} must be a boolean`);
        return required
            ? validator.notEmpty().withMessage(`${field} is required`)
            : validator.optional();
    }

    /**
     * Validate optional boolean field
     * @param {string} field
     * @param {string} [message]
     * @returns {Object}
     */
    static validateOptionalBoolean(field, message = `${field} must be a boolean`) {
        return body(field).optional().isBoolean().withMessage(message);
    }

    /**
     * Validate a date field
     * @param {string} field -field name
     * @param {boolean} [required = true]
     * @returns {Object} - Express validator chain
     */
    static validateDate(field, required = true) {
        const validator = body(field).isDate().withMessage(`${field} must be a valid date`);
        return required
            ? validator.notEmpty().withMessage(`${field} is required`)
            : validator.optional();
    }

    /**
     * Validate optional date fiel
     * @param {string} field
     * @param {string} [message]
     * @returns {Object}
     */
    static validateOptionalDate(field, message = `${field} must be a valid date`) {
        return body(field).optional().isDate().withMessage(message);
    }

    /**
     * Validate an ISO8601 timestamps field
     * @param {string} field
     * @param {boolean} [required = true]
     * @returns {Object} - Express validator chain
     */
    static validateTimestamp(field, required = true) {
        const validator = body(field)
            .isISO8601()
            .withMessage(`${field} must be a valid ISO8601 value`);
        return required
            ? validator.notEmpty().withMessage(`${field} is required`)
            : validator.optional();
    }

    /**
     * Validate if an outlet is exist by ID
     * @param {string} value
     * @throws {Error} - If outlet not found
     */
    static async checkOutletIsExist(value) {
        const outlet = await Outlet.findByPk(value);
        if (!outlet) throw new Error('Outlet not found');
        return true;
    }

    /**
     * Validate if user is exists by ID
     * @param {string} value
     * @throws {Error} - If user is not found
     */
    static async checkUserIsExist(value) {
        const user = await User.findByPk(value);
        if (!user) throw new Error('User not found');
        return true;
    }

    /**
     * Validate if customer is exists by ID
     * @param {string} value
     * @throws {Error} - If customer not found
     */
    static async checkCustomerIsExist(value) {
        const customer = await Customer.findByPk(value);
        if (!customer) throw new Error('Customer not found');
        return true;
    }

    /**
     * Validate if discount is exists by ID
     * @param {string} value
     * @throws {Error} - If discount not found
     */
    static async checkDiscontIsExist(value) {
        const discount = await Discount.findByPk(value);
        if (!discount) throw new Error('Discount not found');
        return true;
    }

    /**
     * Validate if expense is exists by ID
     * @param {string} value
     * @throws {Error} - If expense not found
     */
    static async checkExpenseIsExist(value) {
        const expense = await Expenses.findByPk(value);
        if (!expense) throw new Error('Expense not found');
        return true;
    }

    /**
     * Validate if ingredient is exists by ID
     * @param {string} value
     * @throws {Error} - If ingredient not found
     */
    static async checkIngredientIsExist(value) {
        const ingredient = await Ingredient.findByPk(value);
        if (!ingredient) throw new Error('Ingredient not found');
        return true;
    }

    /**
     * validate if inventory transaction is exists by ID
     * @param {string} value
     * @throws {Error} - If inventory transaction not found
     */
    static async checkInventoryTransactionIsExist(value) {
        const inventoryTransaction = await InventoryTransaction.findByPk(value);
        if (!inventoryTransaction) throw new Error('Inventory transaction not found');
        return true;
    }

    /**
     * Validate if inventory is exists by ID
     * @param {string} value
     * @throws {Error} - If inventory not found
     */
    static async checkInventoryIsExist(value) {
        const inventory = await Inventory.findByPk(value);
        if (!inventory) throw new Error('Inventory not found');
        return true;
    }

    /**
     * Validate if loyalty reward is exists by ID
     * @param {string} value
     * @throws {Error} - If loyalty reward not found
     */
    static async checkLoyaltyRewardIsExist(value) {
        const loyaltyReward = await LoyaltyReward.findByPk(value);
        if (!loyaltyReward) throw new Error('Loyalty reward not found');
        return true;
    }

    /**
     * Validate if loyalty transaction exists by ID
     * @param {string} value
     * @throws {Error} - If loyalty transaction not found
     */
    static async checkLoyaltyTransactionIsExist(value) {
        const loyaltyTransaction = await LoyaltyTransaction.findByPk(value);
        if (!loyaltyTransaction) throw new Error('Loyalty transaction not found');
        return true;
    }

    /**
     * Validate if menu ingredient is exist by ID
     * @param {string} value
     * @throws {Error} - If menu ingredient not found
     */
    static async checkMenuIngredientIsExist(value) {
        const menuIngredient = await MenuIngredient.findByPk(value);
        if (!menuIngredient) throw new Error('Menu ingredient not found');
        return true;
    }

    /**
     * Validate if menu item is exists by ID
     * @param {string} value
     * @throws {Error} - If menu item not found
     */
    static async checkMenuItemIsExist(value) {
        const menuItem = await MenuItem.findByPk(value);
        if (!menuItem) throw new Error('Menu item not found');
        return true;
    }

    /**
     * Validate if menu category is exists by ID
     * @param {string} value
     * @throws {Error} - If menu category not found
     */
    static async checkMenuCategoryIsExist(value) {
        const menuCategory = await MenuCategories.findByPk(value);
        if (!menuCategory) throw new Error('Menu category not found');
        return true;
    }

    /**
     * Validate if order item is exists by ID
     * @param {string} value
     * @throws {Error} - Order item not found
     */
    static async checkOrderItemIsExist(value) {
        const orderItem = await OrderItem.findByPk(value);
        if (!orderItem) throw new Error('Order item not found');
        return true;
    }

    /**
     * Validate if order is exist by Id
     * @param {string} value
     * @throws {Error} if order not found
     */
    static async checkOrderIsExist(value) {
        const order = await Order.findByPk(value);
        if (!order) throw new Error('Order not found');
        return true;
    }

    /**
     * Validate if order tax is exist by ID
     * @param {string} value
     * @throws {Error} - If order tax not found
     */
    static async checkOrderTaxIsExist(value) {
        const orderTax = await OrderTax.findByPk(value);
        if (!orderTax) throw new Error('Order tax not found');
        return true;
    }

    /**
     * Validate if payment is exist by ID
     * @param {string} value
     * @throws {Error} - If payment not found
     */
    static async checkPaymentIsExist(value) {
        const payment = await Payment.findByPk(value);
        if (!payment) throw new Error('Payment not found');
        return true;
    }

    /**
     * Validate if payment split is exist
     * @param {string} value
     * @throws {Error} - If payment split not found
     */
    static async checkPaymentSplitIsExist(value) {
        const paymentSplit = await PaymentSplit.findByPk(value);
        if (!paymentSplit) throw new Error('Split payment not found');
        return true;
    }

    /**
     * Validate if refund is exist by ID
     * @param {string} value
     * @throws {Error} - If refund not found
     */
    static async checkRefundIsExist(value) {
        const refund = await Refund.findByPk(value);
        if (!refund) throw new Error('Refund not found');
        return true;
    }

    /**
     * Validate if shift is exist by ID
     * @param {string} value
     * @throws {Error}
     */
    static async checkShiftIsExist(value) {
        const shift = await Shift.findByPk(value);
        if (!shift) throw new Error('Shift not found');
        return true;
    }

    /**
     * Validate if table category is exist by ID
     * @param {string}
     * @throws {Error}
     */
    static async checkTableCategoryIsExist(value) {
        const tableCategory = await TableCategory.findByPk(value);
        if (!tableCategory) throw new Error('Table category not found');
        return true;
    }

    /**
     * Validate is table number is exist
     * @param {string}
     * @throws {Error}
     */
    static async checkTableNumberIsExist(value) {
        const tableNumber = await Table.findByPk(value);
        if (!tableNumber) throw new Error('Table number not found');
        return true;
    }

    /**
     * Validate if tax is exists
     * @param {string}
     * @throws {Error}
     */
    static async checkTaxIsExist(value) {
        const tax = await Taxes.findByPk(value);
        if (!tax) throw new Error('Tax not found');
        return true;
    }
}

module.exports = BaseValidator;
