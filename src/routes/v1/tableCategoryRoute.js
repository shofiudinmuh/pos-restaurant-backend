const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const tableCategoryController = require('../../controllers/table-category.controller');
const { validate } = require('../../middleware/validationMiddleware');
const {
    createTableCategoryValidator,
    paginationValidator,
    idParamValidator,
    updateTableCategory,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_table_category'),
    validate(createTableCategoryValidator),
    tableCategoryController.createTableCategory
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_table_category'),
    validate(paginationValidator),
    tableCategoryController.getTableCategories
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_table_category'),
    validate([...idParamValidator, ...updateTableCategory]),
    tableCategoryController.updateTableCategory
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_table_category'),
    validate(idParamValidator),
    tableCategoryController.deleteTableCategory
);

module.exports = router;
