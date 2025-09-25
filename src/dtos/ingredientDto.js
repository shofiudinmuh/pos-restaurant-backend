const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');
const { Op } = require('sequelize');

/**
 * @typedef {Object} createIngredientDto
 * @property {string} outletId
 * @property {string} ingredientName
 * @property {string} ingredientUnit
 * @property {number} ingredientMinimumStock
 */

/**
 * Validate & transform data
 * @param {Object} req
 * @returns {createIngredientDto}
 * @throws {ApiError}
 */
class CreateIngredientDto {
    constructor(req) {
        this.req = req;
    }

    validate() {
        const errors = validationResult(this.req);
        if (!errors.isEmpty()) {
            throw new ApiError('Validation failed', 400);
        }

        return {
            outletId: this.req.user.outlet_id,
            ingredientName: this.req.body.name,
            ingredientUnit: this.req.body.unit,
            ingredientMinimumStock: this.req.body.minimum_stock,
        };
    }

    static formRequest(req) {
        const dto = new CreateIngredientDto(req);
        return dto.validate();
    }
}

/**
 * @typedef {Object} updateIngredientDto
 * @property {string} ingredientId
 * @property {string} ingredientName
 * @property {string} ingredientUnit
 * @property {number} ingredientMinimumStock
 */

/**
 * Validate & transform data
 * @param {Object} req
 * @returns {updateIngredientDto}
 * @throws {ApiError}
 */
class UpdateIngredientDto {
    constructor(req) {
        this.req = req;
    }

    validate() {
        const errors = validationResult(this.req);
        const updateData = {};
        if (!errors.isEmpty()) {
            throw new ApiError('Validation failed', 400);
        }

        if (!this.req.params.id) {
            throw new ApiError('Ingredient ID is required for update', 400);
        }

        updateData = {
            ingredientId: this.req.params.id,
        };
        if (this.req.body.name !== undefined) updateData.ingredientName = this.req.body.name;
        if (this.req.body.unit !== undefined) updateData.ingredientUnit = this.req.body.unit;
        if (this.req.body.minimum_stock !== undefined)
            updateData.ingredientMinimumStock = this.req.body.minimum_stock;

        if (Object.keys(updateData).length < 1) {
            throw new ApiError('At least one field is provieded for update', 400);
        }

        return updateData;
    }

    static formRequest(req) {
        const dto = new UpdateIngredientDto(req);
        return dto.validate();
    }
}

/**
 * @typedef {Object} ingredientQueryDto
 * @property {string} page
 * @property {string} limit
 * @property {string} search
 */

/**
 * Validate & transform data
 * @param {Object} queryParams
 * @return {ingredientQueryDto}
 */
class IngredientQueryDto {
    constructor(queryParams) {
        this.page = parseInt(queryParams.page) || 1;
        this.limit = Math.min(parseInt(queryParams.limit) || 10, 100);
        this.sortBy = queryParams.sortBy || 'name';
        this.sortOrder = (queryParams.sortOrder || 'DESC').toUpperCase();
        this.search = queryParams.search || '';
        this.searchField = queryParams.searchField || 'name';
        this.outletId = user.outlet_id;
    }

    validate() {
        this.page = Math.max(1, this.page);
        this.limit = Math.max(1, this.limit);

        const allowedSortFields = ['name', 'minimum_stock', 'created_at'];
        if (!allowedSortFields.includes(this.sortBy)) {
            this.sortBy = 'name';
        }

        const allowedSearchField = ['name', 'minimum_stock', 'unit'];
        if (!allowedSearchField.includes(this.searchField)) {
            this.searchField = 'name';
        }

        return this;
    }

    toRepositoryOptions() {
        return {
            page: this.page,
            limit: this.limit,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            search: this.search,
            searchField: this.searchField,
        };
    }

    formRequest(req) {
        const dto = new IngredientQueryDto(req.query, req.user);
        return dto.validate();
    }
}

module.exports = {
    CreateIngredientDto,
    UpdateIngredientDto,
    IngredientQueryDto,
};
