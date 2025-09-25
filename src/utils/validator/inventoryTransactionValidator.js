const BaseValidator = require('../validator/baseValidator');

class InventoryTransactionValidator extends BaseValidator {
    /**
     * Validator for inventory update
     * @returns {Array}
     */
    static create() {
        return [
            this.validateUUID('ingredient_id'),
            this.validateString('transaction_type'),
            this.validateDecimal('quantity'),
            this.validateString('reason'),
        ];
    }

    /**
     * Validator for inventory ID param
     * @returns {Array}
     */
    static idParam() {
        return [this.validateUUID('inventory_id').custom(this.checkInventoryIsExist)];
    }

    /**
     * Validator for inventory transaction ID param
     * @returns {Array}
     */
    static transactionIdParam() {
        return [this.validateUUID('inventory_transaction_id')];
    }
}

module.exports = InventoryTransactionValidator;
