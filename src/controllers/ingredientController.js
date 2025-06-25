const { Ingredient, Inventory } = require('../models');
const activityLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createIngredient = async (req, res, next) => {
    const transaction = await Ingredient.sequelize.transaction();
    try {
        const { name, unit, minimum_stock } = req.body;
        const { outlet_id } = req.user;

        const ingredient = await Ingredient.create(
            {
                ingredient_id: uuidv4(),
                outlet_id,
                name,
                unit,
                minimum_stock,
            },
            {
                transaction,
            }
        );

        await Inventory.create(
            {
                inventory_id: uuidv4(),
                outlet_id,
                ingredient_id: ingredient.ingredient_id,
                quantity: 0,
            },
            {
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'create_ingredient',
            'ingredients',
            ingredient.ingredient_id,
            `Created ingedient : ${name}`
        );

        await transaction.commit();

        return ApiResponse.success(res, ingredient, 'Ingredient created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getIngredients = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
        const offset = (page - 1) * limit;

        const ingredients = await Ingredient.findAndCountAll({
            where: { outlet_id: req.user.outlet_id },
            include: ['Outlet'],
            attributes: ['ingredient_id', 'outlet_id', 'name', 'unit', 'minimum_stock'],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                ingredients: ingredients.rows,
                pagination: {
                    total: ingredients.count,
                    page,
                    limit,
                    totalPage: Math.ceil(ingredients.count / limit),
                },
            },
            'Ingredient retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getIngredientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ingredient = await Ingredient.findByPk(id);

        if (!ingredient) {
            return ApiResponse.error(res, 'Ingredient not found', 404);
        }

        return ApiResponse.success(res, ingredient, 'Ingredient retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateIngredient = async (req, res, next) => {
    const transaction = await Ingredient.sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, unit, minimum_stock } = req.body;
        const { outlet_id } = req.user;
        const ingredient = await Ingredient.findByPk(id);

        if (!ingredient) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Ingredient not found', 404);
        }

        await ingredient.update({ outlet_id, name, unit, minimum_stock }, { transaction });

        await activityLogService.logActivity(
            req.user.user_id,
            'update_ingredient',
            'ingredients',
            id,
            `Updated ingredient ${ingredient.name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, ingredient, 'Ingredient updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteIngredient = async (req, res, next) => {
    const transaction = await Ingredient.sequelize.transaction();
    try {
        const { id } = req.params;
        const ingredient = await Ingredient.findByPk(id);

        if (!ingredient) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Ingredient not found', 404);
        }

        await ingredient.destroy({ transaction });
        await activityLogService.logActivity(
            req.user.user_id,
            'delete_ingredient',
            'ingredients',
            ingredient.ingredient_id,
            `Deleted ingredient ${ingredient.name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Ingredient deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
