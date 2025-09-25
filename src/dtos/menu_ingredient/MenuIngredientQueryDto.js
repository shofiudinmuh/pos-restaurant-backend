const BaseDto = require('../baseDto');

class MenuIngredientQueryDto extends BaseDto {
    constructor(queryParams, user) {
        super();
        this.page = queryParams.page;
        this.limit = queryParams.limit;
        this.sortBy = queryParams.sortBy;
        this.sortOrder = queryParams.sortOrder;
        this.search = queryParams.search;
        this.searchField = queryParams.searchField;
        this.outlet_id = user.outlet_id;
    }

    validate() {
        this.page = parseInt(this.page) || 1;
        this.limit = parseInt(this.limit) || 10;
        this.sortOrder = (this.sortOrder || 'asc').toUpperCase();
        this.sortBy = this.sortBy || 'name';

        return this;
    }

    toSequelizeOptions() {
        const offset = (this.page - 1) * this.limit;
        const where = { outlet_id: this.outlet_id };
        if (this.search) {
            where[this.searchField] = {
                [Op.iLike]: `%${this.search}%`,
            };
        }

        const options = {
            where,
            order: [[this.sortBy, this.sortOrder.toUpperCase()]],
            limit: this.limit,
            offset,
        };

        return options;
    }

    toResponse(rows, count) {
        return {
            data: rows,
            pagination: {
                total: count,
                page: this.page,
                limit: this.limit,
                totalPages: Math.ceil(count / this.limit),
                hasNextPage: this.page < Math.ceil(count / this.limit),
                hasPreviousPage: this.page > 1,
            },
        };
    }

    static formRequest(req) {
        MenuIngredientQueryDto.validateRequest(req);
        const dto = new MenuIngredientQueryDto(req.query, req.user);
    }
}

module.exports = MenuIngredientQueryDto;
