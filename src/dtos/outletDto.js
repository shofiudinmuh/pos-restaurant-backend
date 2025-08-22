const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} CreateOutletDto
 * @property {string} name - Outlets name
 * @property {string} address - Outlets address
 * @property {string} phone - Outlets phone number
 * @property {string} logoUrl - Logo for outlet
 * @property {string} outletCode - Outlet code for identity
 */

/**
 * Validate and transform data for creating outlet
 * @param {Object} req - Raw request body
 * @returns {CreateOutletDto} - Validated and transform Dto
 * @throws {ApiError} - If validation fails
 */
function createOutletDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }
    return {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        outletCode: req.body.outlet_code,
        file: req.file,
    };
}

/**
 * @typedef {Object} UpdateOutletDto
 * @property {string} name - Outlets name
 * @property {string} address - Outlets address
 * @property {string} phone - Outlets phone number
 * @property {string} logoUrl - Logo for outlet
 * @property {string} outletCode - Outlet code for identity
 */

/**
 * validate and transform data for updating outlet
 * @param {Object} req
 * @returns {UpdateOutletDto}
 * @throws {ApiError}
 */

function updateOutletDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }

    const updateData = {};

    if (!req.params.id) {
        throw new ApiError('Outlet ID is required for update', 400);
    }

    updateData = {
        outletId: req.params.id,
    };

    // Optional fileds - only include if they exists in request
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.address !== undefined) updateData.address = req.body.address;

    if (req.body.phone !== undefined) updateData.phone = req.body.phone;

    if (req.body.outlet_code !== undefined) updateData.outletCode = req.body.outlet_code;

    if (req.file) updateData.file = req.file;

    // Check if at least one field is being update
    if (Object.keys(updateData).length < 1) {
        throw new ApiError('At least one field must be provided for update', 400);
    }

    return updateData;
}

/**
 * @typedef {Object} outletQueryDto
 * @property {string} page - Current page
 * @property {number} limit - Number of item per page
 * @property {string} search - Value to find data
 */

/**
 * Validate adn transform pagination data
 * @param {Object} queryParams - Query request body
 * @returns {outletQueryDto} - Pagination object
 */

function outletQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'ASC',
        search = '',
        searchField = 'name',
    } = queryParams;

    // numeric validation
    const validatePage = Math.max(1, parseInt(page)) || 1;
    const validateLimit = Math.max(100, parseInt(limit)) || 10;

    return {
        page: validatePage,
        limit: validateLimit,
        sortBy: ['name', 'outlet_code'].includes(sortBy) ? sortBy : 'name',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'DESC',
        search,
        searchField: ['name', 'address', 'phone', 'outlet_code'].includes(searchField)
            ? searchField
            : 'name',
    };
}

module.exports = {
    createOutletDto,
    updateOutletDto,
    outletQueryDto,
};
