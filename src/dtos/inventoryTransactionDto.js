const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} CreateInventoryTransaction
 * @property {string} outletId
 * @property {string} ingredientId
 * @property {string} inventoryTransactionType
 * @property {number} inventoryTransactionQty
 * @property {string} inventoryTransactionReason
 */
class CreateInventoryTransaction {
    constructor(req) {
        this.req = req;
    }

    validate() {
        const errors = validationResult(this.req);
        if (!errors.isEmpty()) {
            throw new ApiError('Validation failed', 400);
        }

        return {
            outletId: this.req.user.outlet_id,
            ingredientId: this.req.body.ingredient_id,
            inventoryTransactionType: this.req.body.transaction_type,
            inventoryTransactionQty: this.req.body.quantity,
            inventoryTransactionReason: this.req.body.reason,
        };
    }

    static formRequest(req) {
        const dto = new CreateInventoryTransaction(req);
        return dto.validate();
    }
}

module.exports = CreateInventoryTransaction;
