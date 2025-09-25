const { Op } = require('sequelize');
const BaseDto = require('../baseDto');

class InventoryTransactionQueryDto extends BaseDto {
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
        const where = { oulet_id: this.outlet_id };
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

    static formRequest(req) {
        InventoryTransactionQueryDto.validateRequest(req);
        const dto = InventoryTransactionQueryDto(req.query, req.user);
        return dto.validate();
    }
}

module.exports = InventoryTransactionQueryDto;
