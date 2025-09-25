const BaseDto = require('../baseDto');

class IngredientResponseDto extends BaseDto {
    constructor(ingredient) {
        super();
        this.ingredient_id = ingredient.ingredient_id;
        this.outlet_id = ingredient.outlet_id;
        this.name = ingredient.name;
        this.unit = ingredient.unit;
        this.minimum_stock = ingredient.minimum_stock;
        this.created_at = ingredient.created_at;
        this.updated_at = ingredient.updated_at;

        if (ingredient.Outlet) {
            this.outlet = {
                outlet_id: ingredient.Outlet.outlet_id,
                name: ingredient.Outlet.name,
            };
        }

        if (ingredient.Inventory) {
            this.inventory = {
                quantity: ingredient.Inventory.quantity,
            };
        }
    }

    toResponse() {
        return {
            ingredient_id: this.ingredient_id,
            outlet_id: this.outlet,
            name: this.name,
            unit: this.unit,
            minimum_stock: this.minimum_stock,
            created_at: this.created_at,
            updated_at: this.updated_at,
            ...(this.outlet && { outlet: this.outlet }),
            ...(this.inventory && { inventory: this.inventory }),
        };
    }

    static formEntity(ingredient) {
        const dto = new IngredientResponseDto(ingredient);
        return dto.toResponse();
    }

    static formEntities(ingredients) {
        return ingredients.map((ingredient) => IngredientResponseDto.formEntity(ingredient));
    }
}

module.exports = IngredientResponseDto;
