const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} CreateTableCategoryDto
 * @property {string} outletId - Outlet ID
 * @property {string} categorynName - Table category name
 * @property {string} description - Table category detailed description
 */

/**
 * Validate and transform data
 * @param {Object} req - Raw request from express request
 * @returns {CreateTableCategoryDto} - Validated and transformed data
 * @throws {ApiError} - If validation fails
 */
function createTableCategoryDto(req) {
    const errors = validationResult(req);
    if (!errors) {
        throw new ApiError('Validation failed', 400);
    }
    return {
        outletId: req.user.outlet_id,
        categorynName: req.body.category_name,
        description: req.body.description,
    };
}

/**
 * @typedef {Object} UpdateTableCategoryDto
 * @property {string} outletId - Outlet ID
 * @property {string} categoryName - Table category name
 * @property {string} description - Table category detailed description
 */

/**
 * Validate and transform data
 * @param {Object} req - Raw request data
 * @returns {UpdateTableCategoryDto} - Validated and transform data
 * @throws {ApiError} - If validation fails
 */
function updateTableCategoryDto(req) {
    const errors = validationResult(req);
    if (!errors) {
        throw new ApiError('Validation failed', 400);
    }

    const updateData = {};
    if (!req.params.id) {
        throw new ApiError('Table category ID is required for update', 400);
    }
    updateData = {
        tableCategoryId: req.params.id,
    };
    // Optional field for update
    if (req.body.category_name !== undefined) updateData.categoryName = req.body.category_name;
    if (req.body.description !== undefined) updateData.description = req.body.description;

    //Check if at least one field is being update
    if (Object.keys(updateData).length < 1) {
        throw new ApiError('At least one field must be provided for update', 400);
    }
    return updateData;
}

/**
 * @typedef {Object} tableCategoryQueryDto
 * @property {number} page - Current page
 * @property {number} limit - Number of item per page
 * @property {string} search - Value to find data
 */

/**
 * Validate and transform pagination data
 * @param {Object} queryParams - Query request body
 * @returns {tableCategoryQueryDto} - Pagination object
 */
function tableCategoryQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'category_name',
        sortOrder = 'ASC',
        searchField = 'category_name',
    } = queryParams;
    const { outlet_id } = req.user;

    // Numeric validation
    const validationPage = Math.max(1, parseInt(page)) || 1;
    const validateLimit = Math.max(100, parseInt(limit)) || 10;

    return {
        outletId: outlet_id,
        page: validationPage,
        limit: validateLimit,
        sortBy: ['category_name', 'created_at', 'initial_cash'].includes(sortBy)
            ? sortBy
            : 'category_name',
        sortOrder: sortOrder.toUppercase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: ['category_name', 'description'].includes(searchField)
            ? searchField
            : 'category_name',
    };
}

module.exports = {
    createTableCategoryDto,
    updateTableCategoryDto,
    tableCategoryQueryDto,
};
