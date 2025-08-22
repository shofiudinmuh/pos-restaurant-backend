const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} createTableDto
 * @property {string} outletId - Outlet ID
 * @property {string} tableNumber - table number
 * @property {number} tableCapacity - Customer capacity per table number
 * @property {string} tableCategoryId - Table category
 * @property {string} tableStatus - Table status of occupied or other
 */

/**
 * Validate and transform data
 * @param {Object} req - Raw request from express request
 * @returns {createTableDto} - Validated and transform data
 * @throws {ApiError} - If validation fails
 */
function createTableDto(req) {
    const errors = validationResult(req);
    if (!errors) {
        throw new ApiError('Validation failed', 400);
    }
    const { outlet_id, user_id } = req.user;
    const { table_number, capacity, table_category_id, status } = req.body;
    return {
        outletId: outlet_id,
        userId: user_id,
        tableNumber: table_number,
        tableCapacity: capacity,
        tableCategoryId: table_category_id,
        tableStatus: status,
    };
}

/**
 * @typedef {Object} updateTableDto
 * @property {string} outletId - Outlet ID
 * @property {string} tableNumber - table number
 * @property {number} tableCapacity - Customer capacity per table number
 * @property {string} tableCategoryId - Table category
 * @property {string} tableStatus - Table status of occupied or other
 */

/**
 * Validate and transform data
 * @param {Object} req - Raw request data
 * @returns {updateTableDto} - Validated and transform data
 * @throws {ApiError} - If validation fails
 */
function updateTableDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new ApiError('Table ID is required for update', 400);
    }

    const { table_number, capacity, table_category_id, status } = req.body;
    const updateData = { tableId: id };
    const logData = {
        userId: req.user.user_id,
    };

    if (table_number !== undefined) {
        updateData.tableNumber = table_number.trim();
    }
    if (capacity !== undefined) {
        updateData.tableCapacity = capacity.trim();
    }
    if (table_category_id !== undefined) {
        updateData.tableCategoryId = table_category_id.trim();
    }
    if (status !== undefined) {
        updateData.tableStatus = status.trim();
    }
    // check if at leat one field is being update
    if (Object.keys(updateData).length === 1) {
        throw new ApiError('At least one field be provided for update', 400);
    }
    return {
        updateData,
        logData,
    };
}

/**
 * @typedef {Object} tableQueryDto
 * @property {number} page
 * @property {number} limit
 * @property {string} search
 */

/**
 * Validate and transform pagination data
 * @param {Object} queryParams - query request body
 * @returns {tableQueryDto} - pagination obejct
 */
function tableQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'table_number',
        sortOrder = 'ASC',
        searchField = 'table_number',
    } = queryParams;
    const { outlet_id } = req.user;

    // numeric validation
    const validationPage = Math.max(1, parseInt(page));
    const validateLimit = Math.max(100, parseInt(limit));

    return {
        outletId: outlet_id,
        page: validationPage,
        limit: validateLimit,
        sortBy: ['table_number', 'capacity'].includes(sortBy) ? sortBy : 'table_number',
        sortOrder: sortOrder.toUppperCase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: ['table_number', 'capacity'].includes(searchField)
            ? searchField
            : 'table_number',
    };
}

module.exports = {
    createTableDto,
    updateTableDto,
    tableQueryDto,
};
