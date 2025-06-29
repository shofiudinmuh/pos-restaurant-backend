const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const taxController = require('../../controllers/taxesController');
const { validate } = require('../../middleware/validationMiddleware');
const {
    paginationValidator,
    idParamValidator,
    createTaxesValidator,
    updateTaxesValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_taxes'),
    validate(createTaxesValidator),
    taxController.createTax
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_taxes'),
    validate(paginationValidator),
    taxController.getTaxes
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_taxes'),
    validate([...idParamValidator, ...updateTaxesValidator]),
    taxController.updateTax
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_taxes'),
    validate(idParamValidator),
    taxController.deleteTax
);

module.exports = router;
