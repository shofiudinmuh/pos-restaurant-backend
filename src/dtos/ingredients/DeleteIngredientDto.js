const BaseDto = require('../baseDto');

class DeleteIngredientDto extends BaseDto {
    constructor(params, user) {
        super();
        this.ingredient_id = params.id;
        this.user_id = user.user_id;
    }

    toLogEntity(ingredientName, action = 'delete_ingredient') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'ingredients',
            record: this.ingredient_id,
            description: `Deleted ingredient : ${ingredientName}`,
        };
    }

    static formRequest(req) {
        DeleteIngredientDto.validateRequest(req);
        const dto = new DeleteIngredientDto(req.params, req.user);
        return dto;
    }
}

module.exports = DeleteIngredientDto;
