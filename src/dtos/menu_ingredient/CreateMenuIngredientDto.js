const BaseDto = require('../baseDto');

class CreateIngredientDto extends BaseDto {
    constructor(body, user) {
        super();
        this.outlet_id = user.outlet_id;
        this.menu_id = body.menu_id;
        this.ingredient_id = body.ingredient_id;
        this.quantity = body.quantity;
        this.user_id = user.user_id;
    }

    toEntity() {
        return {
            outlet_id: this.outlet_id,
            menu_id: this.menu_id,
            ingredient_id: this.ingredient_id,
            quantity: this.quantity,
        };
    }

    toLogEntity(menuIngredientId, action = 'create_menu_ingredient') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'menu_ingredients',
            record: menuIngredientId,
            description: `Created menu ingredient ${menuIngredientId}`,
        };
    }

    static formRequest(req) {
        CreateIngredientDto.validateRequest(req);
        const dto = new CreateIngredientDto(req.body, req.user);
        return dto;
    }
}

module.exports = CreateIngredientDto;
