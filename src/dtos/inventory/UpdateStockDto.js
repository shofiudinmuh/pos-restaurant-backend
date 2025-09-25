const BaseDto = require('../baseDto');

class UpdateStockDto extends BaseDto {
    constructor(body, user) {
        super();
        this.outlet_id = user.outlet_id;
        this.user_id = user.user_id;
        this.transaction_type = body.transaction_type;
        this.quantity = body.quantity;
        this.reason = body.reason;
    }

    toEntity() {
        return {
            transaction_type: this.transaction_type,
            quantity: this.quantity,
        };
    }

    toTransactionEntity(ingredientId) {
        return {
            outlet_id: this.outlet_id,
            ingredient_id: ingredientId,
            trasaction_type: this.transaction_type,
            quantity: this.quantity,
            reason: this.reason,
            user_id: this.user_id,
        };
    }

    toLogEntity(action = 'update_stock') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'inventory',
            record: this.ingredient_id,
            description: `Updated stock : ${this.ingredient_id}`,
        };
    }

    static formRequest(req) {
        UpdateStockDto.validateRequest(req);
        const dto = new CreateInventoryTransaction(req.body, req.user);
        return dto;
    }
}

module.exports = UpdateStockDto;
