const { Op } = require('sequelize');
const { Expense } = require('../models');
const ApiError = require('../utils/apiError');

class ExpenseRepository {
    async createExpense(dto) {
        try {
            const expense = await Expense.create({
                shift_id: dto.shiftId,
                description: dto.description,
                amount: dto.amount,
            });

            return expense.toJSON();
        } catch (error) {
            throw new ApiError('Failed to create expense', 500);
        }
    }

    async updateExpense(expenseId, updateData) {
        try {
            const [updated] = await Expense.update(
                {
                    updateData,
                },
                {
                    where: {
                        expense_id: expenseId,
                    },
                    returning: true,
                }
            );

            if (!updated) {
                throw new ApiError('Failed to update expense', 500);
            }
            const expense = await Expense.findOne({
                where: { expense_id: expenseId },
            });
            return expense.toJSON();
        } catch (error) {
            throw error instanceof ApiError ? error : new ApiError('Failed to update expense', 500);
        }
    }

    async getExpenseByShiftId(shiftId, options = {}) {
        try {
            const { page, limit, sortBy, sortOrder, search, searchField } = options;
            const where = { shift_id: shiftId };
            // handle search
            if (search) {
                if (['shift_id', 'description', 'amount']) {
                    where[searchField] = search;
                } else {
                    where[searchField] = { [Op.iLike]: `%${search}%` };
                }
            }
            const { count, rows } = await Expense.findAndCountAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset: (page - 1) * limit,
            });

            return {
                expenses: rows.map((expense) => expense.toJSON()),
                total: count,
                ...options, //return all filter for metadata
            };
        } catch (error) {
            throw new ApiError('Failed to fetch expenses', 500);
        }
    }
}

module.exports = ExpenseRepository;
