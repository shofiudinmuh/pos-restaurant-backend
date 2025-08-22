const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const TableController = require('../../controllers/table.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { TableValidator, PaginationValidator } = require('../../utils/validator');
const tableController = new TableController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_tables'),
    validate(TableValidator.create()),
    tableController.createTable
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_tables'),
    validate(PaginationValidator.pagination()),
    tableController.getTables
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_tables'),
    validate([...TableValidator.idParam(), ...TableValidator.update()]),
    tableController.updateTable
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_tables'),
    validate(TableValidator.idParam()),
    tableController.deleteTable
);

module.exports = router;
