const BaseValidator = require('./baseValidator');

class PaginationValidator extends BaseValidator {
    /**
     * Validate pagination parameters
     * @returns {Array}
     */
    static pagination() {
        return [
            this.validateOptionalNumeric('page')
                .isInt({ min: 1 })
                .withMessage('Page must be a positive value')
                .toInt(),
            this.validateOptionalNumeric('limit')
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1 to 100')
                .toInt(),
            this.validateOptionalString('sortOrder').isIn(['ASC', 'DESC']),
            this.validateOptionalString('sortBy'),
            this.validateOptionalString('search'),
            this.validateOptionalString('searchField'),
        ];
    }
}
module.exports = PaginationValidator;
