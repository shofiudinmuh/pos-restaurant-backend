const BaseValidator = require('./baseValidator');

class LoyaltyRewardValidator extends BaseValidator {
    static create() {
        return [
            this.validateUUID('outlet_id'),
            this.validateString('name')
                .isLength({ min: 3, max: 100 })
                .withMessage('Loyalty name must be 3 - 100 characters'),
            this.validateOptionalString('description'),
            this.validateNumeric('point_required'),
            this.validateString('reward_type'),
            this.validateDecimal('value'),
            this.validateUUID('menu_id'),
            this.validateBoolean('is_active'),
        ];
    }

    static update() {
        return [
            this.validateOptionalString('name'),
            this.validateOptionalString('description'),
            this.validateOptionalNumeric('point_required'),
            this.validateOptionalString('reward_type'),
            this.validateOptionalDecimal('value'),
            this.validateOptionalUUID('menu_id'),
            this.validateOptionalBoolean('is_active'),
        ];
    }

    static idParam() {
        return [this.validateUUID('reward_id').custom(this.checkLoyaltyRewardIsExist)];
    }
}

module.exports = LoyaltyRewardValidator;
