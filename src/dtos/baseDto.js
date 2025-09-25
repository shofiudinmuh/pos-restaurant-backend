const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

class BaseDto {
    constructor() {
        if (new.target === BaseDto) {
            throw new ApiError('BaseDto is an abstract class and cannot instantiated directly');
        }
    }

    static validateRequest(req) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError('Validation failed', 400, errors.array());
        }
    }

    toEntity() {
        throw new ApiError('Method toEntity() must be implemented');
    }

    toResponse() {
        throw new ApiError('Method toResponse() must be implemented');
    }
}

module.exports = BaseDto;
