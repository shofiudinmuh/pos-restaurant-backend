const BaseValidator = require('./baseValidator');

class TableValidator extends BaseValidator {
    static create() {
        return [
            this.validateUUID('outlet_id'),
            this.validateString('table_number'),
            this.validateNumeric('capacity'),
            this.validateUUID('table_category_id'),
            this.validateString('status'),
        ];
    }

    static update() {
        return [
            this.validateOptionalString('table_number'),
            this.validateOptionalNumeric('capacity'),
            this.validateOptionalUUID('table_category_id'),
            this.validateOptionalString('status'),
        ];
    }

    static idParam() {
        return [this.validateUUID('table_id').custom(this.checkTableNumberIsExist)];
    }
}

module.exports = TableValidator;
