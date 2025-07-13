const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const {
    Order,
    MenuItem,
    Taxes,
    OrderTax,
    OrderItem,
    MenuIngredient,
    Inventory,
    Outlet,
    Table,
    User,
} = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');

exports.createOrder = async (req, res, next) => {
    const transaction = await Order.sequelize.transaction();
    try {
        const { outlet_id } = req.user;
        const { table_id, customer_id, order_type, items } = req.body;
        const order_id = uuidv4();

        if (!items?.length) {
            return ApiResponse.error(res, 'No items provided', 400);
        }

        // calculate subtotal
        let subtotal = 0;

        const menuMap = {};
        for (const item of items) {
            const menu = await MenuItem.findOne({
                where: { menu_id: item.menu_id, outlet_id, is_active: true },
                transaction,
            });
            if (!menu) {
                throw new Error(`Menu item with id ${item.menu_id} not found`);
            }
            subtotal += menu.price * item.quantity;
            menuMap[item.menu_id] = menu;
        }

        // prepare data for create reference number
        const currentTotalOrder = await Order.count({
            where: {
                outlet_id,
                created_at: {
                    [Op.between]: [
                        new Date(new Date().setHours(0, 0, 0, 0)), //start of day
                        new Date(new Date().setHours(23, 59, 59, 999)), //end of day
                    ],
                },
            },
            transaction,
        });
        const sequenceNumber = (currentTotalOrder + 1).toString().padStart(4, '0');
        const outlet = await Outlet.findOne({
            where: { outlet_id },
            transaction,
        });

        // get date format
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const outletCode = outlet.outlet_code;
        const reference_number = `ODR-${outletCode}${year}${month}${day}-${sequenceNumber}`;

        // store order
        const order = await Order.create(
            {
                order_id,
                outlet_id,
                table_id,
                customer_id,
                status: 'pending',
                subtotal,
                discount_id: null,
                discount_amount: 0,
                total_amount: 0,
                order_type,
                reference_number,
            },
            { transaction }
        );

        // calculate tax
        const taxes = await Taxes.findAll({
            where: { outlet_id, is_active: true },
            transaction,
        });
        let total_tax = 0;
        for (const tax of taxes) {
            const tax_amount = subtotal * (tax.rate / 100);
            total_tax += tax_amount;

            await OrderTax.create(
                {
                    order_tax_id: uuidv4(),
                    order_id: order.order_id,
                    tax_id: tax.tax_id,
                    tax_amount,
                },
                { transaction }
            );
        }

        const total_amount = subtotal + total_tax;

        await order.update({ total_amount }, { transaction });

        // store order item
        for (const item of items) {
            const menu = menuMap[item.menu_id];

            await OrderItem.create(
                {
                    order_item_id: uuidv4(),
                    order_id,
                    menu_id: menu.menu_id,
                    quantity: item.quantity,
                    price: menu.price,
                    notes: item.notes || null,
                },
                { transaction }
            );

            // calculate inventory
            const menuIngredients = await MenuIngredient.findAll({
                where: { menu_id: item.menu_id, outlet_id },
                transaction,
            });

            for (const menuIngredient of menuIngredients) {
                await Inventory.update(
                    {
                        quantity: Sequelize.literal(
                            `quantity - ${menuIngredient.quantity * item.quantity}`
                        ),
                        last_updated: new Date(),
                    },
                    {
                        where: { outlet_id, ingredient_id: menuIngredient.ingredient_id },
                        transaction,
                    }
                );
            }
        }

        await Table.update({ status: 'occupied' }, { where: { table_id: table_id }, transaction });

        await activityLogService.logActivity(
            req.user.user_id,
            'create_order',
            'orders',
            order_id,
            `Created order at outlet ${outlet_id}`
        );

        await transaction.commit();
        return ApiResponse.success(res, { order_id }, 'Order created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.cancelOrder = async (req, res, next) => {
    const transaction = await Order.sequelize.transaction();
    try {
        const { outlet_id } = req.user;
        const { id } = req.params;
        const { notes, password } = req.body;

        const order = await Order.findOne({
            where: { outlet_id, order_id: id, status: 'pending' },
            transaction,
        });

        if (!order) {
            return ApiResponse.error(res, 'Order not found', 404);
        }

        const user = await User.findOne({
            where: { username: req.user.username },
        });

        if (!user) {
            return ApiResponse.error(res, 'Unauthorized user', 400);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return ApiResponse.error(res, 'Invalid credentials', 401);
        }

        await order.update(
            {
                notes,
                status: 'canceled',
            },
            { transaction }
        );

        // update stock rollback
        for (const item of order.OrderItems) {
            const menuIngredients = await MenuIngredient.findAll({
                where: { menu_id: item.menu_id, outlet_id },
                transaction,
            });

            for (const menuIngredient of menuIngredients) {
                await Inventory.update(
                    {
                        quantity: Sequelize.literal(
                            `quantity + ${menuIngredient.quantity * item.quantity}`
                        ),
                        last_updated: new Date(),
                    },
                    {
                        where: { outlet_id, ingredient_id: menuIngredient.ingredient_id },
                        transaction,
                    }
                );
            }
        }

        // update table status
        await Table.update(
            {
                status: 'available',
            },
            {
                where: { table_id: order.table_id, outlet_id },
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'cancel_order',
            'orders',
            order_id,
            `Canceled order ${order_id}`
        );

        await transaction.commit();
        return ApiResponse.success(res, { order_id }, 'Order canceled successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const { outlet_id } = req.user;
        const {
            search,
            reference_number,
            status,
            customer_id,
            table_id,
            start_date,
            end_date,
            page = 1,
            limit = 10,
            sort = 'desc',
            sortBy = 'created_at',
        } = req.query;
        const offset = (page - 1) * limit;
        const where = { outlet_id };

        // multi search
        if (search) {
            where[Op.or] = [
                { reference_number: { [Op.iLike]: `%${search}%` } },
                Sequelize.where(Sequelize.cast(Sequelize.col('Order.total_amount'), 'TEXT'), {
                    [Op.iLike]: `%${search}%`,
                }),
                { status: { [Op.iLike]: `%${search}%` } },
            ];
        }

        if (reference_number) where.reference_number = reference_number;
        if (status) where.status = status;
        if (customer_id) where.customer_id = customer_id;
        if (table_id) where.table_id = table_id;
        where.status = 'pending';

        // Date filter
        if (start_date || end_date) {
            where.created_at = {};

            if (start_date) {
                const startDate = new Date(start_date);
                if (isNaN(startDate.getTime())) {
                    throw new Error('Invalid start date format');
                }
                // Ensure UTC midnight
                startDate.setUTCHours(0, 0, 0, 0);
                where.created_at[Op.gte] = startDate;
            }

            if (end_date) {
                const endDate = new Date(end_date);
                if (isNaN(endDate.getTime())) {
                    throw new Error('Invalid end_date format');
                }
                // Set to end of day (next day's midnight)
                endDate.setDate(endDate.getDate() + 1);
                endDate.setUTCHours(0, 0, 0, 0);
                where.created_at[Op.lt] = endDate;
            }

            console.log('Date filter:', where.created_at);
        }

        const orders = await Order.findAndCountAll({
            where,
            include: [
                {
                    model: Outlet,
                    attributes: ['name'],
                },
                {
                    model: Table,
                    attributes: ['table_number'],
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
                orders: orders.rows,
                pagination: {
                    total: orders.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPage: Math.ceil(orders.count / limit),
                },
                filters: {
                    applied: Object.keys(req.query)
                        .filter((key) => !['page', 'limit', 'sort', 'sortBy'].includes(key))
                        .map((key) => ({
                            key,
                            value: req.query[key],
                        })),
                },
            },
            'Orders retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getDetailOrderByOrderId = async (req, res, next) => {
    try {
        const { outlet_id } = req.user;
        const { id } = req.params;

        const order = await Order.findOne({
            where: { outlet_id: outlet_id, order_id: id },
        });

        if (!order) {
            return ApiResponse.error(res, 'Order not found', 404);
        }

        return ApiResponse.success(res, order, 'Detail order retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getDetailOrderByTableId = async (req, res, next) => {
    try {
        const { outlet_id } = req.user;
        const { id } = req.params;

        const where = { outlet_id, table_id: id };
        const order = await Order.findOne({
            where,
            status: 'pending',
        });

        if (!order) {
            return ApiResponse.error(res, 'Order not found', 404);
        }

        return ApiResponse.success(res, order, 'Order retrieved successfully');
    } catch (error) {
        next(error);
    }
};
