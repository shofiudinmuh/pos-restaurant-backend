const BaseValidator = require('./baseValidator');

class DiscountValidator extends BaseValidator {
    /**
     * Validate discount-related creation
     */
    static create() {
        return [
            this.validateUUID('outlet_id'),
            this.validateString('name')
                .isLength({ min: 3, max: 100 })
                .withMessage('Discount name must be 3 - 100 characters'),
            this.validateString('type'),
            this.validateDecimal('value'),
            this.validateBoolean('is_member_only'),
            this.validateDate('start_date'),
            this.validateDate('end_date'),
        ];
    }

    static update() {
        return [
            this.validateOptionalString('name'),
            this.validateOptionalString('type'),
            this.validateOptionalDecimal('value'),
            this.validateOptionalBoolean('is_member_only'),
            this.validateOptionalDate('start_date'),
            this.validateOptionalDate('end_date'),
        ];
    }

    static idParam() {
        return [this.validateUUID('discount_id').custom(this.checkDiscontIsExist)];
    }
}

module.exports = DiscountValidator;
