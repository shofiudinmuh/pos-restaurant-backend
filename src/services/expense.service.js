const ExpenseRepository = require('../repositories/expenseRepository');
const ShiftRepository = require('../repositories/shiftRepository');
const ApiError = require('../utils/apiError');

class ExpenseService {
    constructor() {
        this.expenseRepository = new ExpenseRepository();
        this.shiftRepository = new ShiftRepository();
    }

    async createExpense(dto) {
        const isActive = await this.shiftRepository.isShiftActive(dto.shiftId);
        if (!isActive) {
            throw new ApiError('Cannot add expense to a closed or non-existed shift', 400);
        }

        if (dto.createdBy !== dto.kasirId) {
            throw new ApiError('Only the shift chasier can create expenses', 403);
        }
        return this.expenseRepository.createExpense(dto);
    }

    async updateExpense(expenseId, dto) {
        return this.expenseRepository.updateExpense(expenseId, dto.updateData);
    }

    async getExpenseByShift(shiftId) {
        const expense = await this.expenseRepository.getExpenseByShiftId(shiftId);
        if (!expense) {
            throw new ApiError('Expenses not found', 404);
        }
        return this.expenseRepository.getExpenseByShiftId(shiftId);
    }
}

module.exports = ExpenseService;
