const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const inventoryTransactionController = require('../../controllers/inventory-transaction.controller');
const { validate } = require('../../middleware/validationMiddleware');
const {
    paginationValidator,
    idParamValidator,
    createInventoryTransactionValidator,
} = require('../../utils/validators');

router.get(
    '/low-stock',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_inventory_transactions'),
    validate(paginationValidator),
    inventoryTransactionController.getLowStock
);

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('create_inventory_transactions'),
    validate(createInventoryTransactionValidator),
    inventoryTransactionController.updateStock
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_inventory_transactions'),
    validate(paginationValidator),
    inventoryTransactionController.getInventoryTransactionHistory
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_inventory_transactions'),
    validate(idParamValidator),
    inventoryTransactionController.getDetailHistoryInventoryTransaction
);

module.exports = router;
