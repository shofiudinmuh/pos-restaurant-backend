const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const CustomerController = require('../../controllers/customer.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { CustomerValidator, PaginationValidator } = require('../../utils/validator');

const customerController = new CustomerController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_customers'),
    validate(CustomerValidator.create()),
    customerController.createCustomer
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_customers'),
    validate(PaginationValidator.pagination()),
    customerController.getCustomers
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_customers'),
    validate(CustomerValidator.idParam()),
    customerController.getCustomerById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_customers'),
    validate([...CustomerValidator.idParam(), ...CustomerValidator.update()]),
    customerController.updateCustomer
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_customers'),
    validate(CustomerValidator.idParam()),
    customerController.deleteCustomer
);

module.exports = router;
