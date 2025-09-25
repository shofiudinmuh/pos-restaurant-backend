const BaseDto = require('../baseDto');

class InventoryTransactionResponseDto extends BaseDto {
    constructor(inventoryTransaction) {
        super();
        this.inventory_transaction_id = inventoryTransaction.inventory_transaction_id;
        this.outlet_id = inventoryTransaction.outlet_id;
        this.ingredient_id = inventoryTransaction.ingredient_id;
        this.transaction_type = inventoryTransaction.transaction_type;
        this.quantity = inventoryTransaction.quantity;
        this.reason = inventoryTransaction.reason;
        this.user_id = inventoryTransaction.user_id;
        this.created_at = inventoryTransaction.created_at;

        if (inventoryTransaction.Ingredient) {
            this.ingredient_id = {
                ingredient_id: inventoryTransaction.Ingredient.ingredient_id,
                name: inventoryTransaction.Ingredient.name,
            };
        }

        if (inventoryTransaction.User) {
            this.user_id = {
                user_id: inventoryTransaction.User.user_id,
                username: inventoryTransaction.User.username,
            };
        }
    }

    toResponse() {
        return {
            inventory_transaction_id: this.inventory_transaction_id,
            outlet_id: this.outlet_id,
            ingredient_id: this.ingredient_id,
            transaction_type: this.transaction_type,
            quantity: this.quantity,
            reason: this.reason,
            user_id: this.user_id,
            create_at: this.created_at,
            ...(this.outlet && { outlet: this.outlet }),
            ...(this.ingredient && { ingredient: this.ingredient }),
            ...(this.user && { user: this.user }),
        };
    }

    static formEntity(inventoryTransaction) {
        const dto = new InventoryTransactionResponseDto(inventoryTransaction);
        return dto.toResponse();
    }

    static formEntities(inventoryTransactions) {
        return inventoryTransactions.map((inventoryTransaction) =>
            InventoryTransactionResponseDto.formEntity(inventoryTransaction)
        );
    }
}

module.exports = InventoryTransactionResponseDto;
