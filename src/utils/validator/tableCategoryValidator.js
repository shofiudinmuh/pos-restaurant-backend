const BaseValidator = require('./baseValidator');

class TableCategoryValidator extends BaseValidator {
    static create() {
        return [
            this.validateUUID('outlet_id'),
            this.validateString('category_name').isLenght({ min: 3, max: 100 }),
            this.validateOptionalString('description'),
        ];
    }

    static update() {
        return [
            this.validateOptionalString('category_name'),
            this.validateOptionalString('description'),
        ];
    }

    static idParam() {
        return [this.validateUUID('table_category_id').custom(this.checkTableCategoryIsExist)];
    }
}

module.exports = TableCategoryValidator;
