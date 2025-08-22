const BaseValidator = require('./baseValidator');

/**
 * validator for outlet-realted endpoint
 */
class OutletValidator extends BaseValidator {
    /**
     * Validation outlet creation
     * @returns {Array} - Express-validator chain array
     */
    static create() {
        return [
            this.validateString('name')
                .isLength({ min: 3, max: 100 })
                .withMessage('Name must be 3 - 100 characters'),
            this.validateString('address'),
            this.validateString('phone')
                .matches(/^\+?[1-9]\d{1,14}$/)
                .withMessage('Invalid phone number format'),
            this.validateString('logo_url').isURL(),
            this.validateOptionalString('outlet_code'),
        ];
    }

    /**
     * Validation outlet update
     * @returns {Array} -Express-validator chain array
     */
    static update() {
        return [
            this.validateOptionalString('name'),
            this.validateOptionalString('address'),
            this.validateOptionalString('phone'),
            this.validateOptionalString('logo_url'),
            this.validateOptionalString('outlet_code'),
        ];
    }

    /**
     * Validate id params
     * @returns {Array} - Express-validator chain array
     */
    static idParam() {
        return [this.validateUUID('outlet_id').custom(this.checkOutletIsExist)];
    }
}

module.exports = OutletValidator;
