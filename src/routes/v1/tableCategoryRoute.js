const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const TableCategoryController = require('../../controllers/table-category.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { TableCategoryValidator, PaginationValidator } = require('../../utils/validator');
const tableCategoryController = new TableCategoryController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_table_category'),
    validate(TableCategoryValidator.create()),
    tableCategoryController.createTableCategory
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_table_category'),
    validate(PaginationValidator.pagination()),
    tableCategoryController.getTableCategories
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_table_category'),
    validate([...TableCategoryValidator.idParam(), ...TableCategoryValidator.update()]),
    tableCategoryController.updateTableCategory
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_table_category'),
    validate(TableCategoryValidator.idParam()),
    tableCategoryController.deleteTableCategory
);

module.exports = router;
