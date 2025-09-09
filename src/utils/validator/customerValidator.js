const BaseValidator = require('../validator/baseValidator');

class CustomerValidator extends BaseValidator {
    static create() {
        return [
            this.validateString('name')
                .isLength({ min: 3, max: 100 })
                .withMessage('Customer name must be 3-100 characters'),
            this.validateEmail('email'),
            this.validateString('number')
                .matches(/^\+?[1-9]\d{1,14}$/)
                .withMessage('Invalid phone number format'),
            this.validateOptionalString('address'),
            this.validateString('membership_status'),
            this.validateDate('membership_start_date'),
            this.validateString('membership_number'),
        ];
    }

    static update() {
        return [
            this.validateOptionalString('name'),
            this.validateOptionalEmail('email'),
            this.validateOptionalString('number'),
            this.validateOptionalString('address'),
            this.validateOptionalString('membership_status'),
            this.validateOptionalDate('membership_start_date'),
            this.validateOptionalString('membership_number'),
        ];
    }

    static idParam() {
        return [this.validateUUID('customer_id').custom(this.checkCustomerIsExist)];
    }
}
module.exports = CustomerValidator;
