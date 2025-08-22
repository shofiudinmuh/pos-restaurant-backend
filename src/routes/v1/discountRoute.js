const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const DiscountController = require('../../controllers/discount.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { DiscountValidator, PaginationValidator } = require('../../utils/validator');
const discountController = new DiscountController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_discounts'),
    validate(DiscountValidator.create()),
    discountController.createDiscount
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_discounts'),
    validate(PaginationValidator.pagination()),
    discountController.getDiscounts
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_discounts'),
    validate([...DiscountValidator.idParam(), ...DiscountValidator.update()]),
    discountController.updateDiscount
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_discounts'),
    validate(DiscountValidator.idParam()),
    discountController.deleteDiscount
);

module.exports = router;
