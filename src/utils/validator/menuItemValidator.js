const BaseValidator = require('../validator/baseValidator');

class MenuItemValidator extends BaseValidator {
    /**
     * Validation for menu item creation
     * @return {Array}
     */
    static create() {
        return [
            this.validateUUID('outlet_id'),
            this.validateUUID('category_id'),
            this.validateString('name')
                .isLength({ min: 3, max: 100 })
                .withMessage('Menu item name must be 3 - 100 character'),
            this.validateOptionalString('description'),
            this.validateDecimal('price'),
            this.validateBoolean('is_active'),
        ];
    }

    /**
     * Validation for menu item update
     * @return {Array}
     */
    static update() {
        return [
            this.validateOptionalUUID('category_id'),
            this.validateOptionalString('name'),
            this.validateOptionalDecimal('price'),
            this.validateOptionalBoolean('is_active'),
        ];
    }

    /**
     * Validation for id param
     */
    static idParam() {
        return [this.validateUUID('menu_id').custom(this.checkMenuItemIsExist)];
    }
}

module.exports = MenuItemValidator;
