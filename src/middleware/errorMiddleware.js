const ApiResponse = require('../utils/responseHandler');

module.exports = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationnError') {
        return ApiResponse.validationError(res, err.errors, 'Validation failed');
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return ApiResponse.error(res, 'Resource already exists', 409);
    }

    return ApiResponse.error(res, err.message || 'Internal server error', 500);
};
