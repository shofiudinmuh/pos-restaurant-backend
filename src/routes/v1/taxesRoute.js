const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const TaxController = require('../../controllers/taxes.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { TaxValidator, PaginationValidator } = require('../../utils/validator');
const taxController = new TaxController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_taxes'),
    validate(TaxValidator.create()),
    taxController.createTax
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_taxes'),
    validate(PaginationValidator.pagination()),
    taxController.getTaxes
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_taxes'),
    validate([...TaxValidator.idParam(), ...TaxValidator.update()]),
    taxController.updateTax
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_taxes'),
    validate(TaxValidator.idParam()),
    taxController.deleteTax
);

module.exports = router;
