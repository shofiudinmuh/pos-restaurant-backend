const { MenuIngredient, Ingredient } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createMenuIngredient = async (req, res, next) => {
    const transaction = await MenuIngredient.sequelize.transaction();
    try {
        const { menu_id, ingredient_id, quantity } = req.body;
        const { outlet_id } = req.user;

        const menuIngredient = await MenuIngredient.create(
            {
                menu_ingredient_id: uuidv4(),
                outlet_id,
                menu_id,
                ingredient_id,
                quantity,
            },
            {
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'create_menu_ingredient',
            'menu_ingredients',
            menuIngredient.ingredient_id,
            `Created ingredient menu at ${menuIngredient.menu_ingredient_id}`
        );

        await transaction.commit();
        return ApiResponse.success(res, menuIngredient, 'Ingredient menu created successfully');
    } catch (error) {
        next(error);
    }
};

exports.getMenuIngredients = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'created_at' } = req.query;
        const offset = (page - 1) * limit;
        const { outlet_id } = req.user;

        const menuIngredients = await MenuIngredient.findAndCountAll({
            where: {
                outlet_id: outlet_id,
            },
            include: ['Outlet', 'MenuItem', 'Ingredient'],
            attributes: ['menu_id', 'ingredient_id', 'quantity', 'created_at', 'updated_at'],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(res, menuIngredients, 'Menu ingredients retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getMenuIngredientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;
        const ingredient = await MenuIngredient.findOne({
            where: { menu_ingredient_id: id, outlet_id: outlet_id },
            include: ['Outlet', 'MenuItem', 'Ingredient'],
        });

        if (!ingredient) {
            return ApiResponse.error(res, 'Ingredient menu not fount', 404);
        }

        return ApiResponse.success(res, ingredient, 'Ingredient menu retrieved sucessfully');
    } catch (error) {
        next(error);
    }
};

exports.updateMenuIngredient = async (req, res, next) => {
    const transaction = await MenuIngredient.sequelize.transaction();
    try {
        const { id } = req.params;
        const { menu_id, ingredient_id, quantity } = req.body;
        const { outlet_id } = req.user;
        const menuIngredient = await MenuIngredient.findOne({
            where: { menu_ingredient_id: id, outlet_id: outlet_id },
        });

        if (!menuIngredient) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Menu ingredient not found', 404);
        }

        await menuIngredient.update(
            {
                outlet_id: req.user.outlet_id,
                menu_id,
                ingredient_id,
                quantity,
            },
            {
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'update_menu_ingredient',
            'menu_ingredients',
            id,
            `Updated menu ingredient : ${id}`
        );

        await transaction.commit();
        return ApiResponse.success(res, menuIngredient, 'Menu ingredient updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteMenuIngredient = async (req, res, next) => {
    const transaction = await MenuIngredient.sequelize.transaction();
    try {
        const { id } = req.params;
        const menuIngredient = await MenuIngredient.findByPk(id);

        if (!menuIngredient) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Menu ingredient not found', 404);
        }

        await menuIngredient.destroy({ transaction });
        await activityLogService.logActivity(
            req.user.user_id,
            'delete_menu_ingredient',
            'menu_ingredients',
            menuIngredient.id,
            `Deleted menu ingredient : ${id}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Menu ingredient deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
