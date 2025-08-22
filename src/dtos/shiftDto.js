const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');
const { parseISO, isValid } = require('date-fns');

/**
 * @typedef {Object} CreateShiftDto
 * @property {string} outletId - UUID of the outlet
 * @property {string} kasirId - UUID of user
 * @property {string} shiftStart - ISO8601 timestamp
 * @property {number} initialCash - Initial cash amount (non-negative)
 */

/**
 * Validate and transform data for creating shift
 * @param {Object} req - Raw request body
 * @returns {CreateShiftDto} - Validated and transform Dto
 * @throws {ApiError} - If validation fails
 */

function createShiftDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }
    return {
        outletId: req.user.outlet_id,
        kasirId: req.user.user_id,
        shiftStart: data.shift_start,
        initialCash: parseFloat(data.initial_cash),
    };
}

/**
 * @typedef {Object} EndShiftDto
 * @property {number} closingCash - Closing cash omount (non-negative)
 */

/**
 * Validate and transform data for ending a shift
 * @param {Object} req - Raw request body
 * @returns {EndShiftDto} - Validate and transform Dto
 * @throws {ApiError} - If validation fails
 */

function endShiftDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        throw new ApiError('Validation failed', 400);
    }

    return {
        closingCash: parseFloat(data.closing_cash),
    };
}

/**
 * @typedef {Object} shiftQueryDto
 * @property {number} page - Current page
 * @property {number} limit - Number of item per page
 * @property {string} search - Value to find data
 * @property {date} startDate - Start date for filter data by date range
 * @property {date} endDate - End data for filter data by date range
 */

/**
 * Validate and transform pagination data
 * @param {Object} queryParams - Query request body
 * @returns {shiftQueryDto} - Pagination object
 */
function shiftQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'shift_start',
        sortOrder = 'DESC',
        search = '',
        searchField = 'kasir_id',
        startDate,
        endDate,
    } = queryParams;

    // numeric validation
    const validatePage = Math.max(1, parseInt(page)) || 1;
    const validateLimit = Math.max(100, parseInt(limit)) || 10;

    // date range validation
    let validateStartDate, validateEndDate;
    if (startDate) {
        validateStartDate = parseISO(startDate);
        if (!isValid(validateStartDate)) throw new Error('Invalid date format');
    }
    if (endDate) {
        validateEndDate = parseISO(endDate);
        if (!isValid(validateEndDate)) throw new Error('Invalid data format');
    }
    if (startDate && endDate && validateStartDate > validateEndDate) {
        throw new Error('Start date must be before End date');
    }

    return {
        page: validatePage,
        limit: validateLimit,
        sortBy: ['shift_start', 'created_at', 'initial_cash'].includes(sortBy)
            ? sortBy
            : 'shift_start',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'DESC',
        search,
        searchField: ['kasir_id', 'initial_cash', 'notes'].includes(searchField)
            ? searchField
            : 'kasir_id',
        startDate: validateStartDate,
        endDate: validateEndDate,
    };
}

module.exports = {
    createShiftDto,
    endShiftDto,
    shiftQueryDto,
};
