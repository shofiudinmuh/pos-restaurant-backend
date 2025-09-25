const ApiError = require('../../utils/apiError');
const BaseDto = require('../baseDto');

class UpdateIngredientDto extends BaseDto {
    constructor(body, user) {
        super();
        this.name = body.name;
        this.unit = body.unit;
        this.minimum_stock = body.unit;
        this.user_id = user.user_id;
    }

    toEntity() {
        const entity = {};

        if (this.name !== undefined) entity.name = this.name;
        if (this.unit !== undefined) entity.unit = this.unit;
        if (this.minimum_stock !== undefined) entity.minimum_stock = this.minimum_stock;

        if (Object.keys(entity).length < 1) {
            throw new ApiError('At least one field must be provided for update', 400);
        }
        return entity;
    }

    toLogEntity(ingredientId, ingredientName, action = 'update_ingredient') {
        return {
            user_id: this.user_id,
            action,
            table_name: 'ingerdients',
            record_id: ingredientId,
            description: `Updated ingredient : ${ingredientName}`,
        };
    }

    static formRequest(req) {
        UpdateIngredientDto.validateRequest(req);
        const dto = new UpdateIngredientDto(req.body, req.user);
        return dto;
    }
}

module.exports = UpdateIngredientDto;
