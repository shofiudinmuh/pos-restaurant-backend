const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} createLoyaltyRewardDto
 * @property {string} outletId
 * @property {string} loyaltyName
 * @property {string} loyaltyDesc
 * @property {number} pointRequired
 * @property {string} loyaltyType
 * @property {string} loyaltyValue
 * @property {string} menuId
 * @property {boolean} isActive
 */

/**
 * Validate and transform data
 * @param {Object} req
 * @returns {createLoyaltyRewardDto}
 * @throws {ApiError}
 */
function createLoyaltyRewardDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validatin failed', 400);
    }
    const { user_id, outlet_id } = req.user;
    const { name, description, point_required, type, value, menu_id, is_active } = req.body;
    return {
        userId: user_id,
        outletId: outlet_id,
        loyaltyName: name,
        loyaltyDesc: description,
        pointRequired: point_required,
        loyaltyType: type,
        loyaltyValue: value,
        menuId: menu_id,
        isActive: is_active,
    };
}

/**
 * @typedef {Object} updateLoyaltyRewardDto
 * @property {string} outletId
 * @property {string} loyaltyName
 * @property {string} loyaltyDesc
 * @property {string} pointRequired
 * @property {string} loyaltyType
 * @property {number} loyaltyValue
 * @property {string} menuId
 * @property {boolean} isActive
 */

/**
 * Validate and transform data
 * @param {Object} req
 * @returns {updateLoyaltyRewardDto}
 * @throws {ApiError}
 */
function updateLoyaltyRewardDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new ApiError('Reward ID is required for update', 400);
    }
    const { name, description, point_required, type, value, menu_id, is_active } = req.body;
    const updateData = { rewardId: id };
    const logData = { userId: req.user.user_id };

    if (name !== undefined) {
        updateData.loyaltyName = name.trim();
    }
    if (description !== undefined) {
        updateData.loyaltyDesc = description.trim();
    }
    if (point_required !== undefined) {
        updateData.loyaltyType = type.trim();
    }
    if (value !== undefined) {
        updateData.loyaltyValue = type.trim();
    }
    if (menu_id !== undefined) {
        updateData.menuId = menu_id.trim();
    }
    if (is_active !== undefined) {
        updateData.isActive = is_active.trim();
    }

    if (Object.keys(updateData).length === 1) {
        throw new ApiError('At least one field be provided for update', 400);
    }

    return {
        logData,
        updateData,
    };
}

function loyaltyRewardQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'ASC',
        search,
        searchField = 'name',
    } = queryParams;

    const validationPage = Math.max(1, parseInt(page));
    const validationLimit = Math.max(100, parseInt(limit));

    return {
        validationPage,
        validationLimit,
        sortBy: ['name', 'point_required'].includes(sortBy) ? sortBy : 'name',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: ['name', 'point_required', 'value', 'type'].includes(searchField)
            ? searchField
            : 'name',
    };
}

module.exports = {
    createLoyaltyRewardDto,
    updateLoyaltyRewardDto,
    loyaltyRewardQueryDto,
};
