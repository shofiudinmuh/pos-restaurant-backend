const { Sequelize } = require('sequelize');
const { InventoryTransaction, Inventory, Ingredient, sequelize } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.updateStock = async (req, res, next) => {
    const transaction = await Inventory.sequelize.transaction();
    try {
        const { ingredient_id, transaction_type, quantity, reason } = req.body;
        const { user_id, outlet_id } = req.user;
        if (!outlet_id || !ingredient_id || !transaction_type || !quantity || !reason || !user_id) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Missing required fields', 400);
        }

        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Quantity must be a valid positive number', 400);
        }

        if (!['add', 'remove', 'adjust'].includes(transaction_type)) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Invalid transaction type', 400);
        }

        const inventory = await Inventory.findOne({
            where: { ingredient_id, outlet_id },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!inventory) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Inventory not found', 404);
        }

        let newQuantity;
        if (transaction_type === 'add') {
            newQuantity = inventory.quantity + parsedQuantity;
        } else if (transaction_type === 'remove') {
            newQuantity = inventory.quantity - parsedQuantity;
        } else {
            newQuantity = parsedQuantity;
        }

        if (newQuantity < 0) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Insuficient stock', 400);
        }

        await inventory.update(
            {
                quantity: newQuantity,
            },
            { transaction }
        );

        const inventoryTransaction = await InventoryTransaction.create({
            inventory_transaction_id: uuidv4(),
            outlet_id,
            ingredient_id,
            transaction_type,
            quantity: transaction_type === 'remove' ? -quantity : quantity,
            reason,
            user_id: user_id,
        });

        await activityLogService.logActivity(
            req.user.user_id,
            'update_stock',
            'inventory',
            inventoryTransaction.inventory_transaction_id,
            `Updated stock for ingredient ${ingredient_id} with ${transaction_type} of ${quantity}`
        );

        await transaction.commit();
        return ApiResponse.success(res, { inventory }, 'Stock updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.getInventoryTransactionHistory = async (req, res, next) => {
    try {
        const {
            ingredient_id,
            start_date,
            end_date,
            page = 1,
            limit = 10,
            sort = 'asc',
            sortBy = 'created_at',
        } = req.query;
        const offset = (page - 1) * limit;
        const { outlet_id } = req.user;

        if (!outlet_id) {
            return ApiResponse.error(res, 'Outlet ID id required', 400);
        }

        const where = { outlet_id };
        if (ingredient_id) where.ingredient_id = ingredient_id;
        if (start_date && end_date) {
            where.created_at = {
                [Op.between]: [new Date(start_date), new Date(end_date)],
            };
        }

        const transactions = await InventoryTransaction.findAndCountAll({
            where,
            include: [
                { model: Ingredient, attributes: ['name', 'unit'] },
                { model: sequelize.models.User, attributes: ['username'] },
            ],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                transactions: transactions.rows,
                pagination: {
                    total: transactions.count,
                    page,
                    limit,
                    totalPage: Math.ceil(transactions.count / limit),
                },
            },
            'Transaction history retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getDetailHistoryInventoryTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;
        const inventoryTransactionHistory = await InventoryTransaction.findOne({
            where: {
                inventory_transaction_id: id,
                outlet_id: outlet_id,
            },
            include: [
                { model: Ingredient, attributes: ['name'] },
                { model: sequelize.models.User, attributes: ['username'] },
            ],
        });

        if (!inventoryTransactionHistory) {
            return ApiResponse.error(res, 'Inventory transaction not found', 404);
        }

        return ApiResponse.success(
            res,
            inventoryTransactionHistory,
            'Inventory transaction retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getLowStock = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
        const offset = (page - 1) * limit;
        const { outlet_id } = req.user;

        if (!outlet_id) {
            return ApiResponse.error(res, 'Outlet ID not found', 404);
        }

        const lowStock = await Ingredient.findAndCountAll({
            where: { outlet_id },
            include: [
                {
                    model: Inventory,
                    where: Sequelize.where(
                        Sequelize.col('Inventory.quantity'),
                        '<=',
                        Sequelize.col('Ingredient.minimum_stock')
                    ),
                },
            ],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(res, {
            lowStock: lowStock.rows,
            pagination: {
                total: lowStock.count,
                page,
                limit,
                totalPage: Math.ceil(lowStock.count / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};
