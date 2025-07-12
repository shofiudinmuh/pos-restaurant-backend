const { TableCategory } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createTableCategory = async (req, res, next) => {
    const transaction = await TableCategory.sequelize.transaction();
    try {
        const { category_name, description } = req.body;
        const { outlet_id } = req.user;

        const table = await TableCategory.create(
            {
                table_category_id: uuidv4(),
                outlet_id,
                category_name,
                description,
            },
            {
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'create_table_category',
            'table_categories',
            table.table_category_id,
            `Category table created : ${category_name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, 'Table category created successfully', 200);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getTableCategories = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'category_name' } = req.query;
        const offset = (page - 1) * limit;
        const { outlet_id } = req.user;

        const tableCategories = await TableCategory.findAndCountAll({
            where: { outlet_id: outlet_id },
            attributes: ['category_name', 'description'],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(res, {
            tableCategories: tableCategories.rows,
            pagination: {
                total: tableCategories.count,
                page,
                limit,
                totalPage: Math.ceil(tableCategories.count / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.updateTableCategory = async (req, res, next) => {
    const transaction = await TableCategory.sequelize.transaction();
    try {
        const { id } = req.params;
        const { category_name, description } = req.body;
        const { outlet_id } = req.user;

        const tableCategory = await TableCategory.findOne({
            where: { table_category_id: id, outlet_id: outlet_id },
        });

        if (!tableCategory) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Table category not found', 404);
        }

        await tableCategory.update({ category_name, description }, { transaction });

        await activityLogService.logActivity(
            req.user.user_id,
            'update_table_category',
            'table_categories',
            id,
            `Updated table category : ${category_name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, tableCategory, 'Table category updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteTableCategory = async (req, res, next) => {
    const transaction = await TableCategory.sequelize.transaction();
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;
        const tableCategory = await TableCategory.findOne({
            where: { table_category_id: id, outlet_id: outlet_id },
        });

        if (!tableCategory) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Table category not found', 404);
        }

        await tableCategory.destroy({ transaction });

        await activityLogService.logActivity(
            req.user.user_id,
            'delete_table_category',
            'table_categories',
            id,
            `Deleted table category : ${tableCategory.category_name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Table category deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
