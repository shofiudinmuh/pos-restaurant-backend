const BaseDto = require('../baseDto');

class DeleteMenuIngredientDto extends BaseDto {
    constructor(params, user) {
        super();
        this.menu_ingredient_id = params.id;
        this.user_id = user.user_id;
    }

    toLogEntity(menuIngredientName, action = 'delete_menu_ingredient') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'menu_ingredients',
            record: this.menu_ingredient_id,
            description: `Deleted ingredient : ${menuIngredientName}`,
        };
    }

    static formRequest(req) {
        DeleteMenuIngredientDto.validateRequest(req);
        const dto = new DeleteMenuIngredientDto(req.params, req.user);
        return dto;
    }
}

module.exports = DeleteMenuIngredientDto;
