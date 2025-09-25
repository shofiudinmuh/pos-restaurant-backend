const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

class CreateMenuIngredientDto {
    constructor(req) {
        this.req = req;
    }

    validate() {
        const errors = validationResult(this.req);
        if (!errors.isEmpty()) {
            throw new ApiError('Validation failed', 400, errors.array());
        }

        return {
            outletId: this.req.user.outlet_id,
            menuItemId: this.req.body.menu_id,
            ingredientId: this.req.body.ingredient_id,
            menuIngredientQuantity: this.req.body.quantity,
        };
    }

    static formRequest(req) {
        const dto = new CreateMenuIngredientDto(req);
        return dto.validate();
    }
}

class UpdateMenuIngredientDto {
    constructor(req) {
        this.req = req;
    }

    validate() {
        const errors = validationResult(this.req);
        const updateData = {};
        if (!errors.isEmpty()) {
            throw new ApiError('Validation failed', 400, errors.array());
        }

        if (!this.req.params.id) {
            throw new ApiError('Menu ingredient ID is required for update', 400);
        }

        updateData = {
            menuIngredientId: this.req.params.id,
        };

        if (this.req.body.menu_id !== undefined) updateData.menuItemId = this.req.body.menu_id;
        if (this.req.body.ingredient_id !== undefined)
            updateData.menuIngredientId = this.req.body.ingredient_id;
        if (this.req.body.quantity !== undefined)
            updateData.menuIngredientQuantity = this.req.body.quantity;

        if (Object.keys(updateData).length < 1) {
            throw new ApiError('At least one field is provided for update', 400);
        }

        return updateData;
    }

    static formRequest(req) {
        const dto = new UpdateMenuIngredientDto(req);
        return dto.validate();
    }
}

const { Op } = require('sequelize');
class MenuIngredientQueryDto {
    constructor(queryParams) {
        this.page = parseInt(queryParams.page) || 1;
        this.limit = Math.min(parseInt(queryParams.limit) || 10, 100);
        this.sortBy = queryParams.sortBy || 'created_at';
        this.sortOrder = (queryParams.sortOrder || 'DESC').toUpperCase();
        this.search = queryParams.search || '';
    }

    validate() {
        this.page = Math.max(1, this.page);
        this.limit = Math.max(1, this.limit);
        const { outlet_id } = req.user;
        this.outlet_id = outlet_id;

        const allowedSortFields = ['quantity', 'created_at', 'menu_name', 'ingredient_name'];

        if (!allowedSortFields.includes(this.sortBy)) {
            this.sortBy = 'created_at';
        }

        if (this.sortOrder !== 'ASC' && this.sortOrder !== 'DESC') {
            this.sortOrder = 'DESC';
        }

        return this;
    }

    toSequelizeOptions(models) {
        const offset = (this.page - 1) * this.limit;

        const searchCondition = this.search
            ? {
                  [Op.or]: [
                      { '$MenuItem.name$': { [Op.iLike]: `%${this.search}%` } },
                      { '$Ingredient.name$': { [Op.iLike]: `%${this.search}%` } },
                  ],
              }
            : {};

        const where = { ...searchCondition };
        if (this.outlet_id) where.outlet_id = this.outlet_id;

        let order;
        if (this.sortBy === 'menu_name') {
            order = [[{ model: models.MenuItem, as: 'MenuItem' }, 'name', this.sortOrder]];
        } else if (this.sortBy === 'ingredient_name') {
            order = [[{ model: models.Ingredient, as: 'Ingredient' }, 'name', this.sortOrder]];
        } else {
            order = [[this.sortBy, this.sortOrder]];
        }

        return {
            where,
            include: [
                {
                    model: models.MenuItem,
                    as: 'MenuItem',
                    attributes: ['name'],
                    required: !!this.search,
                },
                {
                    model: models.Ingredient,
                    as: 'Ingredient',
                    attributes: ['name'],
                    required: !!this.search,
                },
            ],
            order,
            limit: this.limit,
            offset,
            distinct: true,
        };
    }

    toResponse(rows, count) {
        const data = rows.map((item) => ({
            menu_ingredient_id: item.menu_ingredient_id,
            outlet_id: item.outlet_id,
            menu_name: item.MenuItem ? item.MenuItem.name : 'N/A',
            ingredient_name: item.Ingredient ? item.Ingredient.name : 'N/A',
            unit: item.Ingredient ? item.Ingredient.unit : 'N/A',
            quantity: item.quantity,
            created_at: item.created_at,
        }));

        return {
            data,
            pagination: {
                current_page: this.page,
                per_page: this.limit,
                total: count,
                total_page: Math.ceil(count / this.limit),
            },
            search: this.search,
        };
    }
}

module.exports = {
    CreateMenuIngredientDto,
    UpdateMenuIngredientDto,
    MenuIngredientQueryDto,
};
