const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const discountController = require('../../controllers/discount.controller');
const { validate } = require('../../middleware/validationMiddleware');
const {
    paginationValidator,
    idParamValidator,
    updateDiscountsValidator,
    createDiscountsValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_discounts'),
    validate(createDiscountsValidator),
    discountController.createDiscount
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_discounts'),
    validate(paginationValidator),
    discountController.getDiscounts
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_discounts'),
    validate([...idParamValidator, ...updateDiscountsValidator]),
    discountController.updateDiscount
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_discounts'),
    validate(idParamValidator),
    discountController.deleteDiscount
);

module.exports = router;
