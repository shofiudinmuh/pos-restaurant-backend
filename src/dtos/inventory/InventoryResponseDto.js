const BaseDto = require('../baseDto');

class InventoryResponseDto extends BaseDto {
    constructor(inventory) {
        super();
        this.inventory_id = inventory.inventory_id;
        this.outlet_id = inventory.outlet_id;
        this.ingredient_id = inventory.ingredient_id;
        this.quantity = inventory.quantity;
        this.created_at = inventory.created_at;
        this.updated_at = inventory.updated_at;

        if (inventory.Outlet) {
            this.outlet = {
                outlet_id: inventory.Outlet.outlet_id,
                name: inventory.Outlet.name,
            };
        }

        if (inventory.Ingredient) {
            this.ingredient = {
                ingredient_id: inventory.Ingredient.ingredient_id,
                name: inventory.Ingredient.name,
            };
        }
    }

    toResponse() {
        return {
            inventory_id: this.inventory_id,
            outlet_id: this.outlet_id,
            ingredient_id: this.ingredient_id,
            quantity: this.quantity,
            created_at: this.created_at,
            updated_at: this.updated_at,
            ...(this.outlet && { outlet: this.outlet }),
            ...(this.ingredient && { ingredient: this.ingredient }),
        };
    }

    static formEntity(inventory) {
        const dto = new InventoryResponseDto(inventory);
        return dto.toResponse();
    }

    static formEntities(inventories) {
        return inventories.map((inventory) => InventoryResponseDto.formEntity(inventory));
    }
}

module.exports = InventoryResponseDto;
