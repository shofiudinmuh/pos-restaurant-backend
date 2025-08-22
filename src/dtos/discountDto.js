const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} createDiscountDto
 * @property {string} outletId
 * @property {string} discountName
 * @property {string} discountType
 * @property {number} discountValue
 * @property {boolean} discountForMemberOnly
 */

/**
 * Validate and transform data
 * @param {Object} req - Raw request params
 * @returns {createDiscountDto} - Validated and transformed data
 * @throws {ApiError} - If validation fails
 */
function createDiscountDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }
    const { user_id, outlet_id } = req.user;
    const { name, type, value, is_member_only } = req.body;
    return {
        userId: user_id,
        outletId: outlet_id,
        discountName: name,
        discountType: type,
        discountValue: value,
        discountForMemberOnly: is_member_only,
    };
}

/**
 * @typedef {Object} updateDiscountDto
 * @property {string} outletId
 * @property {string} discountName
 * @property {string} discountType
 * @property {number} discountValue
 * @property {boolean} discountForMemberOnly
 */

/**
 * Validate and transform
 * @param {Object} req
 * @returns {updateDiscountDto}
 * @throws {ApiError}
 */
function updateDiscountDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }

    const { id } = req.params;
    if (!id) {
        throw new ApiError('Discount ID is required for update', 400);
    }

    const { name, type, value, is_member_only } = req.body;
    const updateData = { discountId: id };
    const logData = { userId: req.user.user_id };

    if (name !== undefined) {
        updateData.discountName = name.trim();
    }
    if (type !== undefined) {
        updateData.discountType = type.trim();
    }
    if (value !== undefined) {
        updateData.discountValue = value.trim();
    }
    if (is_member_only !== undefined) {
        updateData.discountForMemberOnly = is_member_only.trim();
    }

    // check if at least one field is being update
    if (Object.keys(updateData).length === 1) {
        throw new ApiError('At least one file be provided for update', 400);
    }

    return {
        updateData,
        logData,
    };
}

function discountQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'ASC',
        search,
        searchField = 'name',
    } = queryParams;
    const outletId = req.user.outlet_id;
    // numeric validation
    const validationPage = Math.max(1, parseInt(page));
    const validationLimit = Math.max(100, parseInt(limit));

    return {
        outletId,
        page: validationPage,
        limit: validationLimit,
        sortBy: ['name', 'created_at'].includes(sortBy) ? sortBy : 'name',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: ['name', 'value', 'type'].includes(searchField) ? searchField : 'name',
    };
}

module.exports = {
    createDiscountDto,
    updateDiscountDto,
    discountQueryDto,
};
