const { MenuCategories } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createMenuCategory = async (req, res, next) => {
    const transaction = await MenuCategories.sequelize.transaction();
    try {
        const { outlet_id, category_name, description } = req.body;

        const menuCategory = await MenuCategories.create(
            {
                category_id: uuidv4(),
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
            'create_menu_category',
            'menu_categories',
            menuCategory.category_id,
            `Created menu category: ${category_name}`
        );

        await transaction.commit();

        return ApiResponse.success(res, menuCategory, 'Menu category created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getMenuCategories = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'category_name' } = req.query;
        const offset = (page - 1) * limit;

        const menuCategories = await MenuCategories.findAndCountAll({
            attributes: ['category_id', 'outlet_id', 'category_name', 'description'],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                menuCategories: menuCategories.rows,
                pagination: {
                    total: menuCategories.count,
                    page,
                    limit,
                    totalPages: Math.ceil(menuCategories.count / limit),
                },
            },
            'Menu categories retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getMenuCategoriesById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const menuCategory = await MenuCategories.findByPk(id);

        if (!menuCategory) {
            return ApiResponse.error(res, 'Menu category not found', 404);
        }

        return ApiResponse.success(res, menuCategory, 'Menu category retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateMenuCategory = async (req, res, next) => {
    const transaction = await MenuCategories.sequelize.transaction();
    try {
        const { id } = req.params;
        const { outlet_id, category_name, description } = req.body;
        const menuCategory = await MenuCategories.findByPk(id);

        if (!menuCategory) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Menu category not found', 404);
        }

        await menuCategory.update(
            {
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
            'update_menu_category',
            'menu_categories',
            menuCategory.category_id,
            `Updated menu category: ${category_name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, menuCategory, 'Menu category updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteMenuCategory = async (req, res, next) => {
    const transaction = await MenuCategories.sequelize.transaction();
    try {
        const { id } = req.params;
        const menuCategory = await MenuCategories.findByPk(id);

        if (!menuCategory) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Menu category not found', 404);
        }

        await menuCategory.destroy({ transaction });
        await activityLogService.logActivity(
            req.user.user_id,
            'delete_menu_category',
            'menu_categories',
            menuCategory.category_id,
            `Deleted menu category: ${menuCategory.category_name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Menu category deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
