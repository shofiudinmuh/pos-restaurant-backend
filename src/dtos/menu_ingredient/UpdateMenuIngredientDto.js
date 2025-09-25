const ApiError = require('../../utils/apiError');
const BaseDto = require('../baseDto');

class UpdateMenuIngredientDto extends BaseDto {
    constructor(body, user) {
        super();
        this.menu_id = body.menu_id;
        this.ingredient_id = body.ingredient_id;
        this.quantity = body.quantity;
        this.user_id = user.user_id;
    }

    toEntity() {
        const entity = {};

        if (this.menu_id !== undefined) entity.menu_id = this.menu_id;
        if (this.ingredient_id !== undefined) entity.ingredient_id = this.ingredient_id;
        if (this.quantity !== undefined) entity.quantity = this.quantity;

        if (Object.keys(entity).length < 1) {
            throw new ApiError('At least one field must be provided for update', 400);
        }

        return entity;
    }

    toLogEntity(menuIngredientId, menuIngredientName, action = 'update_menu_ingredient') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'menu_ingredients',
            record: menuIngredientId,
            description: `Updated menu ingredient : ${menuIngredientName}`,
        };
    }

    static formRequest(req) {
        UpdateMenuIngredientDto.validateRequest(req);
        const dto = new UpdateMenuIngredientDto(req.body, req.user);
        return dto;
    }
}

module.exports = UpdateMenuIngredientDto;
