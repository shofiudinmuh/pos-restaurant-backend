const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/responseHandler');

module.exports = {
    validate: (validations) => {
        return async (req, res, next) => {
            try {
                // run all validation cocurrently
                await Promise.all(validations.map((validation) => validation.run(req)));

                // check for validation error
                const errors = validationResult(req);
                if (!errors.isEmpty) {
                    // format error for concistent response
                    const formattedErrors = errors.array().map((err) => ({
                        field: err.path,
                        message: err.msg,
                        value: err.value,
                    }));

                    return ApiResponse.validationError(res, formattedErrors, 'Validation failed');
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    },

    // custom async validator for database check
    asyncValidate: (field, checkFunction, errorMessage) => {
        return async (req, res, next) => {
            try {
                const value = req.body[field] || req.params[field] || req.query[field];
                const isValid = await checkFunction(value, req);
                if (!isValid) {
                    return ApiResponse.validationError(
                        res,
                        [
                            {
                                field,
                                message: errorMessage,
                                value,
                            },
                        ],
                        'Validation failed '
                    );
                }
                next();
            } catch (error) {
                next(error);
            }
        };
    },
};
