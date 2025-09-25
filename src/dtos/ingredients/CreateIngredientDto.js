const BaseDto = require('../baseDto');

class CreateIngredientDto extends BaseDto {
    constructor(body, user) {
        super();
        this.name = body.name;
        this.unit = body.unit;
        this.minimum_stock = body.minimum_stock;
        this.outlet_id = user.outlet_id;
        this.user_id = user.user_id;
    }

    toEntity() {
        return {
            name: this.name.trim(),
            unit: this.unit.trim(),
            minimum_stock: this.minimum_stock,
            outlet_id: this.outlet_id,
        };
    }

    toInventoryEntity(ingredientId) {
        return {
            outlet_id: this.outlet_id,
            ingredient_id: ingredientId,
            quantity: 0,
        };
    }

    toLogEntity(ingredientId, action = 'create_ingredient') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'ingredients',
            record_id: ingredientId,
            description: `Created ingredient : ${this.name}`,
        };
    }

    static formRequest(req) {
        CreateIngredientDto.validateRequest(req);
        const dto = new CreateIngredientDto(req.body, req.user);
        return dto;
    }
}
module.exports = CreateIngredientDto;
