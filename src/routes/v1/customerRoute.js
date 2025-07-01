const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const customerController = require('../../controllers/customerController');
const { validate } = require('../../middleware/validationMiddleware');
const {
    createCustomerValidator,
    paginationValidator,
    idParamValidator,
    updateCustomerValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_customers'),
    validate(createCustomerValidator),
    customerController.createCustomer
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_customers'),
    validate(paginationValidator),
    customerController.getCustomers
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_customers'),
    validate(idParamValidator),
    customerController.getCustomerById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_customers'),
    validate([...idParamValidator, ...updateCustomerValidator]),
    customerController.updateCustomer
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_customers'),
    validate(idParamValidator),
    customerController.deleteCustomer
);

module.exports = router;
