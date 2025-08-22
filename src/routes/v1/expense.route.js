const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validationMiddleware');
const ExpenseController = require('../../controllers/expense.controller');
const { ExpenseValidator, PaginationValidator } = require('../../utils/validator');
const expenseController = new ExpenseController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_expenses'),
    validate(ExpenseValidator.create()),
    expenseController.createExpense
);

router.put(
    '/:expenseId',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_expenses'),
    validate(ExpenseValidator.update()),
    expenseController.updateExpense
);

router.get(
    '/:shiftId',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_expenses'),
    validate([ExpenseValidator.idParamShiftId(), PaginationValidator.pagination()]),
    expenseController.getExpenseByShiftId
);

module.exports = router;
