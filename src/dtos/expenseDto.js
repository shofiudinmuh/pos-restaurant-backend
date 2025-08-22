const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');
const Shift = require('../models');
/**
 * @typedef {Object} CreateExpenseDto
 * @typedef {string} shiftId - Shift active
 * @property {string} description - Description of expense at active shift
 * @property {number} amount - Amount for expense
 */

/**
 * Validate and transform data for creating expense
 * @param {Object} req - Raw request body
 * @returns {CreateExpenseDto} - Validate and transform Dto
 * @throws {ApiError} - If validation fails
 */

async function createExpenseDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        throw new ApiError('Validation failed', 400);
    }

    const activeShift = await Shift.findOne({
        where: {
            kasir_id: req.user.user_id,
            end_shift: null,
        },
    });

    if (!activeShift) {
        throw new ApiError('There is not any active shift for user', 400);
    }
    return {
        shift_id: activeShift.shift_id,
        description: req.description,
        amount: parseFloat(req.amount),
    };
}

/**
 * @typedef {Object} UpdateExpenseDto
 * @property {string} description - Expense update description
 * @property {number} amount - Expense amount upadate
 * @property {string} expenseId - Expense update ID
 */

/**
 * Validate and transform data for updateing expense
 * @param {Object} req - Raw request body
 * @returns {UpdateExpenseDto} - Validate and transform Dto
 * @throws {ApiError} - If validation fails
 */

function updateExpenseDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        throw new ApiError('Validation failed', 400);
    }

    const updateData = {};

    // ID should always be required for update
    if (!req.id) {
        throw new ApiError('Expense ID is required for update', 400);
    }

    updateData = data.id;

    // Optional fields - only include if they exists in request
    if (data.description !== undefined) {
        updateData.description = data.description;
    }
    if (data.amount !== undefined) {
        updateData.amount = data.amount;
    }

    // Check if at least one field is being update
    if (Object.keys(updateData).length <= 1) {
        throw new ApiError('At least one field must be provided for update', 400);
    }

    return updateData;
}

/**
 * @typedef {Object} expenseQueryDto
 * @property {number} page - Current page
 * @property {number} limit - NUmber of item per page
 * @property {string} search -Params to find data
 */

/**
 * Validate and transform pagination data
 * @param {Object} queryParams - Query request body
 * @returns {expenseQueryDto} - Pagination and object filters
 */

function expenseQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        search = '',
        searchField = 'shift_id',
    } = queryParams;

    // numeric validation
    const validatePage = Math.max(1, parseInt(page)) || 1;
    const validateLimit = Math.max(100, parseInt(limit)) || 10;

    return {
        page: validatePage,
        limit: validateLimit,
        sortBy: ['created_at', 'amount'].includes(sortBy) ? sortBy : 'created_at',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'DESC',
        search,
        searchField: ['shift_id', 'description', 'amount'].includes(searchField)
            ? searchField
            : 'amount',
    };
}

module.exports = {
    createExpenseDto,
    updateExpenseDto,
    expenseQueryDto,
};
