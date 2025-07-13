const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validationMiddleware');
const {
    paginationValidator,
    createRefundValidator,
    idParamValidator,
} = require('../../utils/validators');

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_payments'),
    validate(paginationValidator),
    paymentController.getPayments
);

router.post(
    '/:id/refund',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_payments'),
    validate([...idParamValidator, ...createRefundValidator]),
    paymentController.refundPayment
);

module.exports = router;
