const ExpenseService = require('../services/expense.service');
const ApiResponse = require('../utils/responseHandler');
const { createExpenseDto, updateExpenseDto, expenseQueryDto } = require('../dtos/expenseDto');

class ExpenseController {
    constructor() {
        this.expenseService = new ExpenseService();
    }

    async createExpense(req, res, next) {
        try {
            const dto = createExpenseDto(req.dtoData);
            const shift = await this.expenseService.shiftRepository.getShiftById(dto.shiftId);
            if (!shift) {
                return ApiResponse.error(res, 'Shift not found', 404);
            }
            dto.kasirId = shift.kasir_id;
            const expense = await this.expenseService.createExpense(dto);
            return ApiResponse.success(res, expense, 'Expense created successfully');
        } catch (error) {
            next(error);
        }
    }

    async updateExpense(req, res, next) {
        try {
            const dto = updateExpenseDto(req.dtoData);
            const expenseUpdate = await this.expenseService.updateExpense(
                req.params.expenseId,
                dto
            );
            if (!expenseUpdate) {
                return ApiResponse.error(res, 'Failed to update expense', 400);
            }
            return ApiResponse.success(res, expenseUpdate, 'Expense updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async getExpenseByShiftId(req, res, next) {
        try {
            const filters = expenseQueryDto(req.query);
            const data = await this.expenseService.getExpenseByShift(req.params.shiftId, filters);
            return ApiResponse.success(
                res,
                {
                    data: data.expenses,
                    meta: {
                        total: data.total,
                        page: pagination.page,
                        limit: pagination.limit,
                        totalPage: Math.ceil(data.total / pagination.limit),
                        sort: `${data.sortBy} ${data.sortOrder}`,
                        search: data.search
                            ? {
                                  field: data.searchField,
                                  keyword: data.search,
                              }
                            : null,
                    },
                },
                'Expenses retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ExpenseController;
