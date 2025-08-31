const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * @typedef {Object} createCustomerDto
 * @property {string} customerName
 * @property {string} customerEmail
 * @property {string} customerPhone
 * @property {string} customerAddress
 * @property {string} customerMemberStatus
 * @property {string} customerMemberStartDate
 */

/**
 * Validate and transform data for creating customer
 * @param {Object} req
 * @returns {createCustomerDto}
 * @throws {ApiError}
 */

function createCustomerDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }

    return {
        customerName: req.body.name,
        customerEmail: req.body.email,
        customerPhone: req.body.phone,
        customerAddress: req.body.address,
        customerMemberStatus: req.body.membership_status,
        customerMemberStartDate: req.body.membership_start_date,
    };
}

/**
 * @typedef {Object} updateCustomerDto
 * @property {string} customerId
 * @property {string} customerName
 * @property {string} customerEmail
 * @property {string} customerPhone
 * @property {string} customerAddress
 * @property {string} customerMemberStatus
 * @property {string} customerMemberStartDate
 */

/**
 * Validate and transform data for update customer
 * @param {Object} req
 * @returns {updateCustomerDto}
 * @throws {ApiError}
 */
function updateCustomerDto(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError('Validation failed', 400);
    }

    const updateData = {};
    if (!req.params.id) {
        throw new ApiError('Customer ID is required');
    }
    updateData = {
        customerId: req.params.id,
    };
    // optional field for update
    if (req.body.name !== undefined) updateData.customerName = req.body.name;
    if (req.body.email !== undefined) updateData.customerEmail = req.body.email;
    if (req.body.phone !== undefined) updateData.customerPhone = req.body.phone;
    if (req.body.address !== undefined) updateData.customerAddress = req.body.address;
    if (req.body.membership_status !== undefined)
        updateData.customerMemberStatus = req.body.membership_status;
    if (req.body.membership_start_date !== undefined)
        updateData.customerMemberStartDate = req.body.membership_start_date;

    // check if at least one fiel is being update
    if (Object.keys(updateData).length < 1) {
        throw new ApiError('At least one field must be provided to update');
    }
    return updateData;
}

/**
 * @typedef {Object} customerQueryDto
 * @property {number} page - Current page
 * @property {number} limit - Number of limit per page
 * @property {string} search
 */

/**
 * Validate and transform pagination data
 * @param {Object} queryParams
 * @returns {customerQueryDto}
 */
function customerQueryDto(queryParams) {
    const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'ASC',
        searchField = 'name',
    } = queryParams;

    //Numeric validation
    const validationPage = Math.max(1, parseInt(page));
    const validateLimit = Math.max(100, parseInt(limit));

    return {
        page: validationPage,
        limit: validateLimit,
        sortBy: ['name', 'created_at'] ? sortBy : 'name',
        sortOrder: sortOrder.toUpperCase() === 'ASC' ? 'DESC' : 'ASC',
        search,
        searchField: [
            'name',
            'email',
            'address',
            'membership_status',
            'membership_number',
        ].includes(searchField)
            ? searchField
            : 'name',
    };
}

module.exports = {
    createCustomerDto,
    updateCustomerDto,
    customerQueryDto,
};
