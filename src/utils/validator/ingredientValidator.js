const BaseValidator = require('./baseValidator');

class IngredientValidator extends BaseValidator {
    /**
     * Validator for ingredient creation
     * @returns {Array}
     */
    static create() {
        return [
            this.validateString('name'),
            this.validateString('unit'),
            this.validateDecimal('minimum_stock'),
        ];
    }

    /**
     * Validator for ingredient update
     * @returns {Array}
     */
    static update() {
        return [
            this.validateOptionalString('name'),
            this.validateOptionalString('unit'),
            this.validateOptionalDecimal('minimum_stock'),
        ];
    }

    /**
     * Validator for ID param
     * @returns {Array}
     */
    static idParam() {
        return [this.validateUUID('ingredient_id').custom(this.checkIngredientIsExist)];
    }
}

module.exports = IngredientValidator;
