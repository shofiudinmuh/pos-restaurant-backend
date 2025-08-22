const BaseValidator = require('../validator/baseValidator');

class TaxValidator extends BaseValidator {
    static create() {
        return [
            this.validateUUID('outlet_id'),
            this.validateString('name')
                .isLength({ min: 3, max: 100 })
                .withMessage('Name must be 3 - 100 characters'),
            this.validateDecimal('rate'),
            this.validateBoolean('is_active'),
        ];
    }

    static update() {
        return [
            this.validateOptionalString('name'),
            this.validateOptionalDecimal('rate'),
            this.validateOptionalBoolean('is_active'),
        ];
    }

    static idParam() {
        return [this.validateUUID('tax_id').custom(this.checkTaxIsExist)];
    }
}

module.exports = TaxValidator;
