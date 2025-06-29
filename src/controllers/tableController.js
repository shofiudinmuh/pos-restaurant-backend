const { Table } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createTable = async (req, res, next) => {
    const transaction = await Table.sequelize.transaction();
    try {
        const { outlet_id } = req.user;
        const { table_number, capacity, table_category_id, status } = req.body;

        const table = await Table.create(
            {
                table_id: uuidv4(),
                outlet_id,
                table_number,
                capacity,
                table_category_id,
                status,
            },
            { transaction }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'create_table',
            'tables',
            table.table_id,
            `Created table number : ${table_number}`
        );

        await transaction.commit();
        return ApiResponse.success(res, table, 'Table number created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getTables = async (req, res, next) => {
    try {
        const { outlet_id } = req.user;
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'table_number' } = req.query;
        const offset = (page - 1) * limit;

        const tables = await Table.findAndCountAll({
            where: { outlet_id: outlet_id },
            include: ['TableCategory'],
            attributes: ['table_number', 'capacity', 'table_category_id', 'status'],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                tables: tables.rows,
                pagination: {
                    total: tables.count,
                    page,
                    limit,
                    totalPage: Math.ceil(tables.count / page),
                },
            },
            'Table number retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.updateTables = async (req, res, next) => {
    const transaction = await Table.sequelize.transaction();
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;
        const { table_number, capacity, table_category_id, status } = req.body;

        const table = await Table.findOne({
            where: { table_id: id, outlet_id: outlet_id },
        });

        if (!table) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Table number not found', 404);
        }

        await table.update(
            {
                outlet_id,
                table_number,
                capacity,
                table_category_id,
                status,
            },
            { transaction }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'update_table_number',
            'tables',
            id,
            `Updated table number : ${table_number}`
        );

        await transaction.commit();
        return ApiResponse.success(res, table, 'Table number updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteTable = async (req, res, next) => {
    const transaction = await Table.sequelize.transaction();
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;

        const table = await Table.findOne({
            where: { table_id: id, outlet_id: outlet_id },
        });

        if (!table) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Table number not found', 404);
        }

        await table.destroy({ transaction });

        await activityLogService.logActivity(
            req.user.user_id,
            'delete_table_number',
            'tables',
            id,
            `Deleted table number : ${table.table_number}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Table number deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
