const { Sequelize, Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const {
    Payment,
    CustomerPoint,
    LoyaltyTransaction,
    Order,
    Discount,
    PaymentSplit,
    Table,
    Refund,
    Outlet,
    User,
} = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');

exports.payOrder = async (req, res, next) => {
    const transaction = await Payment.sequelize.transaction();
    try {
        const { id } = req.params;
        const { amount, payment_method, splits, reedem_reward_id, discount_id, customer_id } =
            req.body;
        const { outlet_id } = req.user;

        // get data order
        const order = await Order.findOne({
            where: { order_id: id, outlet_id: outlet_id },
            transaction,
        });

        if (!order) {
            return ApiResponse.error(res, 'Order not found', 404);
        }

        let final_amount = Number(order.total_amount);

        // reedem point
        if (reedem_reward_id && customer_id) {
            const reward = await LoyaltyReward.findOne({
                where: { reward_id: reedem_reward_id, outlet_id, is_active: 'true' },
                transaction,
            });

            if (!reward) throw new Error('Reward not found');

            const customerPoint = await CustomerPoint.findOne({
                where: { outlet_id, customer_id },
                transaction,
            });

            if (!customerPoint || customerPoint.total_points <= reward.point_required) {
                throw new Error('Insufficient points');
            }

            // update customer point
            customerPoint.total_points -= reward.point_required;
            await CustomerPoint.save({ transaction });

            await LoyaltyTransaction.create(
                {
                    loyalty_transaction_id: uuidv4(),
                    customer_id,
                    order_id: id,
                    point_earned: 0,
                    point_redeemed: reward.point_required,
                    transaction_type: 'redeem',
                },
                {
                    transaction,
                }
            );

            // apply reward/point discount
            if (reward.reward_type === 'free_item') {
                const orderItem = order.OrderItems.find((oi) => oi.menu_id === reward.menu_id);
                if (!orderItem) throw new Error('Reward item not found for this order');

                const freeQty = Math.min(reward.quantity, orderItem.quantity);
                const freeAmount = freeQty * orderItem.price;

                final_amount -= freeAmount;
                orderItem.quantity -= freeQty;

                if (orderItem.quantity < 0) {
                    orderItem.quantity = 0;
                    await orderItem.save({ transaction });
                }

                await orderItem.save({ transaction });
            } else if (reward.reward_type === 'discount') {
                final_amount -= reward.value;
            }
        }

        // apply discount
        let discount_amount = 0;
        if (discount_id) {
            const discount = await Discount.findOne({
                where: {
                    discount_id,
                    outlet_id,
                    start_date: { [Sequelize.Op.lte]: new Date() },
                    [Sequelize.Op.or]: [
                        { end_date: null },
                        { end_date: { [Sequelize.Op.gte]: new Date() } },
                    ],
                },
                transaction,
            });

            if (!discount) {
                throw new Error('Invalid or expired discount');
            }

            if (discount.is_member_only && !customer_id) {
                throw new Error('Discount is for member only');
            }

            discount_amount =
                discount.type === 'precentage' ? subtotal * (discount.value / 100) : discount.value;

            final_amount -= discount_amount;
        }

        // prevent negatif value
        if (final_amount < 0) final_amount = 0;

        // customer point
        if (customer_id) {
            const earnedPoint = Math.floor(total_amount / 10000);
            const [customerPoint, created] = await CustomerPoint.findAll({
                where: { outlet_id, customer_id },
                default: {
                    point_id: uuidv4(),
                    total_points: earnedPoint,
                },
                transaction,
            });

            if (!created) {
                customerPoint.total_points += earnedPoint;
                await customerPoint.save({ transaction });
            }

            await LoyaltyTransaction.create(
                {
                    loyalty_transaction_id: uuidv4(),
                    customer_id,
                    order_id: id,
                    point_earned: earnedPoint,
                    point_redeemed: 0,
                    transaction_type: 'earn',
                },
                { transaction }
            );
        }

        // final check
        if (Number(amount) < final_amount) {
            return ApiResponse.error(res, 'Insufficient payment amount', 400);
        }

        // create payment
        const payment = await Payment.create(
            {
                payment_id: uuidv4(),
                outlet_id,
                order_id: id,
                amount,
                payment_method,
                payment_status: 'completed',
                reference_number: `PAY-${payment_method.toUpperCase()}-${Date.now()}-${Math.floor(
                    Math.random() * 1000
                )}`,
                payment_date: new Date(),
                user_id: req.user.user_id,
            },
            { transaction }
        );

        // if payment with split payment
        if (splits?.length > 0) {
            for (const split of splits) {
                await PaymentSplit.create(
                    {
                        split_payment_id: uuidv4(),
                        amount: split.amount,
                        payment_method: split.payment_method,
                        user_id: req.user.user_id,
                        payment_id: payment.payment_id,
                        status: 'completed',
                        reference_number: `SPLIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    },
                    { transaction }
                );
            }
        } else {
            await PaymentSplit.create(
                {
                    split_payment_id: uuidv4(),
                    amount: amount,
                    payment_method,
                    user_id: req.user.user_id,
                    payment_id: payment.payment_id,
                    status: 'completed',
                    reference_number: `SPLIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                },
                { transaction }
            );
        }

        const change_amount = amount - final_amount;

        // update order
        await order.update(
            {
                status: 'completed',
                paid_amount: amount,
                change_amount,
            },
            { transaction }
        );

        await Table.update(
            {
                status: 'available',
            },
            {
                where: { table_id: order.table_id },
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'pay_order',
            'orders',
            id,
            `Order paid with ${payment_method}`
        );

        await transaction.commit();
        return ApiResponse.success(res, { id, final_amount, change_amount }, 'Payment successfull');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.refundPayment = async (req, res, next) => {
    const transaction = await Refund.sequelize.transaction();
    try {
        const { outlet_id } = req.user;
        const { order_id } = req.params;
        const { payment_id, reason } = req.body;
        const { user_id } = req.user;

        // validate order & payment
        const order = await Order.findOne({
            where: { order_id, outlet_id },
            include: [{ model: Payment }],
            transaction,
        });

        if (!order) {
            return ApiResponse.error(res, 'Order not found', 404);
        }

        const payment = await Payment.findOne({
            where: { payment_id, order_id },
            transaction,
        });

        if (!payment) {
            return ApiResponse.error(res, 'Payment not found for this order', 404);
        }

        if (Number(amount) > Number(payment.amount)) {
            return ApiResponse.error(res, 'Refund amount cannot exceed payment amount', 400);
        }

        // create refund
        const refund = await Refund.create(
            {
                refund_id: uuidv4(),
                order_id,
                payment_id,
                amount: order.total_amount,
                reason,
                status: 'completed',
                processed_by: user_id,
            },
            { transaction }
        );

        // update order & payment
        await order.update(
            {
                paid_amount: 0,
                change_amount: 0,
            },
            { transaction }
        );

        await payment.update(
            {
                payment_status: 'refunded',
            },
            { transaction }
        );

        await activityLogService.logActivity(
            user_id,
            'refunded_payment',
            'refunds',
            refund.refund_id,
            `Refund processed for order ${order_id} with amount ${amount}`
        );

        await transaction.commit();
        return ApiResponse.success(res, refund, 'Refund processed successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getAllPayments = async (req, res, next) => {
    try {
        const { outlet_id } = req.user;
        const {
            start_date,
            end_date,
            payment_status,
            customer_id,
            page = 1,
            limit = 10,
            sort = 'desc',
            sortBy = 'created_at',
        } = req.query;
        const offset = (page - 1) * limit;
        const where = { outlet_id };
        if (payment_status) where.payment_status = payment_status;
        if (customer_id) where.customer_id = customer_id;

        // date filter
        if (start_date || end_date) {
            where.created_at = {};

            if (start_date) {
                const startDate = new Date(start_date);
                if (isNaN(startDate.getTime())) {
                    throw new Error('Invalid start date format');
                }
                // ensure UTC midnight
                startDate.setUTCHours(0, 0, 0, 0);
                where.created_at[Op.gte] = startDate;
            }

            if (end_date) {
                const endDate = new Date(end_date);
                if (isNaN(endDate.getTime())) {
                    throw new Error('Invalid end date format');
                }
                // set to end of day(next day midnight)
                endDate.setDate(endDate.getDate() + 1);
                endDate.setUTCHours(0, 0, 0, 0);
                where.created_at[Op.lt] = endDate;
            }

            console.log('Date filter : ', where.created_at);
        }

        const payments = await Payment.findAndCountAll({
            where,
            include: [
                {
                    model: Outlet,
                    attributes: ['name'],
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
            order: [[sortBy, sort]],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true,
        });

        return ApiResponse.success(
            res,
            {
                payments: payments,
                pagination: {
                    total: payments.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPage: Math.ceil(payments.count / limit),
                },
            },
            'Payments retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};
