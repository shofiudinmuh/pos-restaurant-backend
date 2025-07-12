const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/order.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validationMiddleware');
const {
    createOrderValidator,
    createPaymentValidator,
    createRefundValidator,
    paginationValidator,
    idParamValidator,
    cancelOrderValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_orders'),
    validate(createOrderValidator),
    orderController.createOrder
);

router.post(
    '/:id/cancel',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_orders'),
    validate(cancelOrderValidator)
);

router.post(
    '/:id/pay',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_payments'),
    validate(createPaymentValidator),
    orderController.payOrder
);

router.post(
    '/:id/refund',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_payments'),
    validate(createRefundValidator),
    orderController.refundPayment
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_orders'),
    validate(paginationValidator),
    orderController.getOrders
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_orders'),
    validate(idParamValidator),
    orderController.getDetailOrderByOrderId
);

router.get(
    '/table/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_orders'),
    validate(idParamValidator),
    orderController.getDetailOrderByTableId
);

module.exports = router;
