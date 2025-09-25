const BaseValidator = require('../validator/baseValidator');

class MenuIngredientValidator extends BaseValidator {
    /**
     * Validator for menu ingredient creation
     * @returns {Array}
     */
    static create() {
        return [
            this.validateUUID('menu_id'),
            this.validateUUID('ingredient_id'),
            this.validateDecimal('quantity'),
        ];
    }

    /**
     * Validator for menu ingredient update
     * @returns {Array}
     */
    static update() {
        return [
            this.validateOptionalUUID('menu_id'),
            this.validateOptionalUUID('ingredient_id'),
            this.validateOptionalDecimal('quantity'),
        ];
    }

    /**
     * Id param validator
     * @returns {Array}
     */
    static idParam() {
        return [this.validateUUID('menu_ingredient_id').custom(this.checkMenuIngredientIsExist)];
    }
}
module.exports = MenuIngredientValidator;
