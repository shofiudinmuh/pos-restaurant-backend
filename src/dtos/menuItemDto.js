const validationResult = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} createMenuItemDto
 * @param {string} outletId
 * @param {string} categoryId
 * @param {string} menuItemName
 * @param {string} menuItemDesc
 * @param {number} menuItemPrice
 * @param {file} menuPhoto
 * @param {boolean} menuItemActiveStatus
 */

/**
 * Validate and transfrom data
 * @param {Object} req
 * @returns {createMenuItemDto}
 * @throws {ApiError}
 */
function createMenuItemDto(req) {
    const errors = validationResult(req);
    if (!errors) {
        throw new ApiError('Validation failed', 400);
    }

    return {
        outletId: req.user.outlet_id,
        categoryId: req.body.category_id,
        menuItemName: req.body.name,
        menuItemDesc: req.body.description,
        menuItemPrice: req.body.price,
        photoFile: req.file,
        menuItemActiveStatus: req.body.is_active,
    };
}

/**
 * @typedef {Object} updateMenuItemDto
 * @param {string} categoryId
 * @param {string} menuItemName
 * @param {string} menuItemDesc
 * @param {number} menuItemPrice
 * @param {file} menuPhoto
 * @param {boolean} menuItemActiveStatus
 */

/**
 * Validate and transform data
 * @param {Object} req
 * @returns {updateMenuItemDto}
 * @throws {ApiError}
 */
function updateMenuItemDto(req) {
    const updateData = {};
    if (!req.param.id) {
        throw new ApiError('Menu ID is required to update', 400);
    }

    updateData = {
        menuId: req.param.id,
    };

    if (req.body.category_id && !undefined) categoryId = req.body.category_id;
    if (req.body.name && !undefined) menuItemName = req.body.name;
    if (req.body.description && !undefined) menuItemDesc = req.body.description;
    if (req.body.price && !undefined) menuItemPrice = req.body.price;
    if (req.file) menuPhoto = req.file;
    if (req.body.is_active && !undefined) menuItemActiveStatus = req.body.is_active;

    if (Object.keys(updateData).length < 1) {
        throw new ApiError('At least one field must be provided for update', 400);
    }

    return updateData;
}

/**
 * @typedef {Object} menuItemQueryDto
 * @param {string} page
 * @param {string} limit
 * @param {string} search
 */

/**
 * Validate & transform
 * @param {Object} queryParams
 * @returns {menuItemQueryDto}
 */
function menuItemQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        orderBy = 'name',
        sortOrder = 'ASC',
        search = '',
        searchField = 'name',
    } = queryParams;
    const { outlet_id } = req.user.outlet_id;

    //numeric validation
    const validatePage = Math.max(1, parseInt(page)) || 1;
    const validateLimit = Math.max(100, parseInt(limit)) || 10;

    return {
        outletId: outlet_id,
        page: validatePage,
        limit: validateLimit,
        sortBy: ['name', 'description'].includes(sortBy) ? sortBy : 'name',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: ['name', 'description'].includes(searchField) ? searchField : 'name',
    };
}

module.exports = {
    createMenuItemDto,
    updateMenuItemDto,
    menuItemQueryDto,
};
