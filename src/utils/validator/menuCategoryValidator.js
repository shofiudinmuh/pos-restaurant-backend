const BaseValidator = require('../validator/baseValidator');

class MenuCategoryValidator extends BaseValidator {
    /**
     * Validation for menu category creation
     * @returns {Array}
     */
    static create() {
        return [
            this.validateString('category_name')
                .isLength({ min: 3, max: 100 })
                .withMessage('Category name must be 3 - 100 character'),
            this.validateOptionalString('description'),
        ];
    }

    /**
     * Validation for menu category update
     * @returns {Array}
     */
    static update() {
        return [
            this.validateOptionalString('category_name'),
            this.validateOptionalString('description'),
        ];
    }

    /**
     * Validation for id param
     * @returns {Array}
     */
    static idParam() {
        return [this.validateUUID('category_id').custom(this.checkMenuCategoryIsExist)];
    }
}

module.exports = MenuCategoryValidator;
