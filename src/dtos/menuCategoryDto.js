const validationResult = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} createMenuCategoryDto
 * @param {string} outletId
 * @param {string} menuCategoryName
 * @param {string} menuCategoryDesc
 */

/**
 * Validate and transform data for creating menu category
 * @param {Object} req - Raw request body
 * @returns {createMenuCategoryDto} - Validated and transform Dto
 * @throws {ApiError} - If validation fails
 */
function createMenuCategoryDto(req) {
    const errors = validationResult(req);
    if (!errors) {
        throw new ApiError('Validation failed', 400);
    }
    return {
        outletId: req.user.outlet_id,
        menuCategoryName: req.body.category_name,
        menuCategoryDesc: req.body.description,
    };
}

/**
 * @typedef {Object} updateMenuCategoryDto
 * @param {string} menuCategoryName
 * @param {string} menuCategoryDesc
 */

/**
 * Validate and transform data for updating menu category
 * @param {Object} req
 * @returns {updateMenuCategoryDto}
 * @throws {ApiError} if validation fails
 */
function updateMenuCategoryDto(req) {
    const updateData = {};
    if (!req.params.id) {
        throw new ApiError('Menu category is required to update', 400);
    }
    updateData = {
        menuCategoryId: req.params.id,
    };
    if (req.body.category_name && !undefined) updateData.menuCategoryName = req.body.category_name;
    if (req.body.description && !undefined) updateData.menuCategoryDesc = req.body.description;

    if (Object.keys(updateData).length < 1) {
        throw new ApiError('At leats one field must be provided to update', 400);
    }

    return updateData;
}

/**
 * @typedef menuCategoryQueryDto
 * @param {string} page
 * @param {string} limit
 * @param {string} search
 */

/**
 * Validate and transform data for
 * @param {object} queryParams
 * @returns {menuCategoryQueryDto}
 */
function menuCategoryQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'category_name',
        sortOrder = 'ASC',
        search = '',
        searchField = 'category_name',
    } = queryParams;
    const { outlet_id } = req.user.outlet_id;

    //numeric validation
    const validatePage = Math.max(1, parseInt(page)) || 1;
    const validateLimit = Math.max(100, parseInt(limit)) || 10;

    return {
        outletId: outlet_id,
        page: validatePage,
        limit: validateLimit,
        sortBy: ['category_name', 'description'].includes(sortBy) ? sortBy : 'category_name',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: ['category_name', 'description'].includes(searchField)
            ? searchField
            : 'category_name',
    };
}

module.exports = {
    createMenuCategoryDto,
    updateMenuCategoryDto,
    menuCategoryQueryDto,
};
