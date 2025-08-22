const BaseValidator = require('./baseValidator');

class ExpenseValidator extends BaseValidator {
    static create() {
        return [
            this.validateString('description'),
            this.validateNumeric('amount'),
            this.validateUUID('created_by'),
        ];
    }

    static update() {
        return [this.validateOptionalString('description'), this.validateOptionalNumeric('amount')];
    }

    static idParam() {
        return [this.validateUUID('expense_id').custom(this.checkExpenseIsExist)];
    }

    static idParamShiftId() {
        return [this.validateUUID('shift_id').custom(this.checkShiftIsExist)];
    }
}

module.exports = ExpenseValidator;
