const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} createTaxDto
 * @property {string} outletId
 * @property {string} taxName
 * @property {number} taxRate
 * @property {boolean} taxIsActive
 */

/**
 * Validate and transform data
 * @param {Object} req
 * @returns {createTaxDto}
 * @throws {ApiError} - If validation fails
 */
function createTaxDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }

    const { outlet_id, user_id } = req.user;
    const { name, rate, is_active } = req.body;
    return {
        outletId: outlet_id,
        userId: user_id,
        taxName: name,
        taxRate: rate,
        taxIsActive: is_active,
    };
}

/**
 * @typedef {Object} updateTaxDto
 *  @property {string} taxName
 * @property {number} taxRate
 * @property {boolean} taxIsActive
 */

/**
 * Validate and transform data
 * @param {Object} req
 * @returns {updateTaxDto}
 * @throws {ApiError}
 */
function updateTaxDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }

    const { id } = req.params;
    if (!id) {
        throw new ApiError('Tax ID is required for update', 400);
    }

    const { name, rate, is_active } = req.body;
    const updateData = { tabledId: id };
    const logData = {
        userId: req.user.user_id,
    };

    if (name !== undefined) {
        updateData.taxName = name.trim();
    }
    if (rate !== undefined) {
        updateData.taxRate = rate.trim();
    }
    if (is_active !== undefined) {
        updateData.taxIsActive = is_active.trim();
    }

    //CHeck if at leat one field is beinfg update
    if (Object.keys(updateData).length === 1) {
        throw new ApiError('At least one field be provided for update', 400);
    }

    return {
        taxId: id,
        updateData,
        logData,
    };
}

function taxQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'ASC',
        searchField = 'name',
    } = queryParams;

    const { outlet_id } = req.user;

    // numeric validation
    const validatePage = Math.max(1, parseInt(page));
    const validateLimit = Math.max(100, parseInt(limit));

    return {
        outletId: outlet_id,
        page: validatePage,
        limit: validateLimit,
        sortBy: ['name', 'rate'].includes(sortBy) ? sortBy : 'name',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: ['name', 'rate'].includes(searchField) ? searchField : 'name',
    };
}

module.exports = {
    createTaxDto,
    updateTaxDto,
    taxQueryDto,
};
