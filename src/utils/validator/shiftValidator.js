const BaseValidator = require('./baseValidator');

class ShiftValidator extends BaseValidator {
    static create() {
        return [
            this.validateUUID('outlet_id'),
            this.validateUUID('kasir_id'),
            this.validateNumeric('initial_cash'),
        ];
    }

    static endShift() {
        return [this.validateNumeric('closing_cash')];
    }

    static idParam() {
        return [this.validateUUID('shift_id').custom(this.checkShiftIsExist)];
    }

    static idParamOutletId() {
        return [this.validateUUID('outlet_id').custom(this.checkOutletIsExist)];
    }
}
module.exports = ShiftValidator;
