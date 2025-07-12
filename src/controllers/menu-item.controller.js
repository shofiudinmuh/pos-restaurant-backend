const { MenuItem } = require('../models');
const activityLogService = require('../services/activityLogService');
const StorageService = require('../services/storageService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createMenuItem = async (req, res, next) => {
    const transaction = await MenuItem.sequelize.transaction();
    try {
        const { outlet_id, category_id, name, description, price, is_active } = req.body;
        let photo_url = null;

        if (req.file) {
            photo_url = await StorageService.uploadFile(req.file, 'menu_photos');
        }

        const menuItem = await MenuItem.create(
            {
                menu_id: uuidv4(),
                outlet_id,
                category_id,
                name,
                description,
                price,
                photo_url,
                is_active,
            },
            {
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'create_menu_item',
            'menu_items',
            menuItem.menu_id,
            `Created menu item : ${name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, menuItem, 'Menu item created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getMenuItems = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
        const offset = (page - 1) * limit;

        const menuItems = await MenuItem.findAndCountAll({
            attributes: [
                'menu_id',
                'outlet_id',
                'category_id',
                'name',
                'price',
                'description',
                'photo_url',
                'is_active',
            ],
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                menuItems: menuItems.rows,
                pagination: {
                    total: menuItems.count,
                    page,
                    limit,
                    totalPages: Math.ceil(menuItems.count / limit),
                },
            },
            'Menu items retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.getMenuItemById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            return ApiResponse.error(res, 'Menu item not found', 404);
        }

        return ApiResponse.success(res, menuItem, 'Menu item retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateMenuItem = async (req, res, next) => {
    const transaction = await MenuItem.sequelize.transaction();
    try {
        const { id } = req.params;
        const { outlet_id, category_id, name, description, price, is_active } = req.body;
        let photo_url = req.body.photo_url;

        const menuItem = await MenuItem.findByPk(id);
        if (!menuItem) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Menu item not found', 404);
        }

        if (req.file) {
            await StorageService.deleteFile(menuItem.photo_url);
        }

        photo_url = await StorageService.uploadFile(req.file, 'menu_photos');

        await menuItem.update(
            {
                outlet_id,
                category_id,
                name,
                description,
                price,
                photo_url,
                is_active,
            },
            {
                transaction,
            }
        );

        await activityLogService.logActivity(
            req.user.user_id,
            'update_menu_item',
            'menu_items',
            id,
            `Updated menu item : ${name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, menuItem, 'Menu item updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteMenuItem = async (req, res, next) => {
    const transaction = await MenuItem.sequelize.transaction();
    try {
        const { id } = req.params;
        const menuItem = await MenuItem.findByPk(id);

        if (!menuItem) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Menu item not found', 404);
        }

        // delete photo id exists
        if (menuItem.photo_url) {
            await StorageService.deleteFile(menuItem.photo_url);
        }

        await menuItem.destroy({ transaction });
        await activityLogService.logActivity(
            req.user.user_id,
            'delete_menu_item',
            'menu_items',
            id,
            `Deleted menu item : ${menuItem.name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Menu item deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
