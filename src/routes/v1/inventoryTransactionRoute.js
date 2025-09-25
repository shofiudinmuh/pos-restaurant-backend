const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const InventoryTransactionController = require('../../controllers/inventory-transaction.controller');
const InventoryController = require('../../controllers/inventory.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { InventoryTransactionValidator, PaginationValidator } = require('../../utils/validator');

const inventoryController = new InventoryController();
const inventoryTransactionController = new InventoryTransactionController();
router.get(
    '/low-stock',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_inventory'),
    validate(PaginationValidator.pagination()),
    inventoryController.getLowStock
);

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('create_inventory_transactions'),
    validate(InventoryTransactionValidator.create()),
    inventoryController.updateInventory
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_inventory'),
    validate(PaginationValidator.pagination()),
    inventoryController.getInventories
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_inventory'),
    validate(InventoryTransactionValidator.idParam()),
    inventoryController.deleteInventory
);

router.get(
    '/transactions',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_inventory_transaction'),
    validate(PaginationValidator.pagination()),
    inventoryTransactionController.getInventoryTransactions
);

router.get(
    '/transaction/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_inventory_transaction'),
    validate(InventoryTransactionValidator.transactionIdParam()),
    inventoryTransactionController.getInventoryTransaction
);

module.exports = router;
