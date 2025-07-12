const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const tableController = require('../../controllers/table.controller');
const { validate } = require('../../middleware/validationMiddleware');
const {
    createTableValidator,
    paginationValidator,
    idParamValidator,
    updateTableValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_tables'),
    validate(createTableValidator),
    tableController.createTable
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_tables'),
    validate(paginationValidator),
    tableController.getTables
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_tables'),
    validate([...idParamValidator, ...updateTableValidator]),
    tableController.updateTables
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_tables'),
    validate(idParamValidator),
    tableController.deleteTable
);

module.exports = router;
