const { Op } = require('sequelize');
const MenuItem = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class MenuItemRepository {
    async createMenuItem({
        outletId,
        categoryId,
        menuItemName,
        menuItemDesc,
        menuItemPrice,
        photoUrl,
        menuItemIsActive,
    }) {
        try {
            return await MenuItem.create({
                menu_id: uuidv4(),
                outletId,
                categoryId,
                menuItemName,
                menuItemDesc,
                menuItemPrice,
                photoUrl,
            });
        } catch (error) {
            throw new ApiError('Failed to create menu item', 500);
        }
    }

    async updateMenuItem(
        menuId,
        { categoryId, menuItemName, menuItemDesc, menuItemPrice, menuItemIsActive }
    ) {
        try {
            const updateData = {};
            if (categoryId && !undefined) updateData.category_id = categoryId;
            if (menuItemName && !undefined) updateData.name = menuItemName;
            if (menuItemDesc && !undefined) updateData.description = menuItemDesc;
            if (menuItemPrice && !undefined) updateData.price = menuItemPrice;
            if (photoUrl && !undefined) updateData.photo_url = photoUrl;
            if (menuItemIsActive && !undefined) updateData.is_active = menuItemIsActive;

            if (Object.keys(updateData).length === 0) {
                throw new ApiError('At least one field must be provided for update', 400);
            }

            const [updated] = await MenuItem.update(updateData, {
                where: { menu_id: menuId },
                returning: true,
            });

            if (!updated) {
                throw new ApiError('Menu item not found', 404);
            }

            return await MenuItem.findByPk(menuId);
        } catch (error) {
            throw new ApiError('Failed to update menu item', 500);
        }
    }

    async getMenuItemById(menuId) {
        try {
            return await MenuItem.findByPk(menuId);
        } catch (error) {
            throw new ApiError('Failed to fetch menu item', 500);
        }
    }

    async getMenuItems(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'name',
                sortOrder = 'ASC',
                search,
                searchField = 'name',
            } = options;
            const where = {};

            if (search) {
                where[searchField] = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const [count, rows] = await MenuItem.findAndCountAll({
                where,
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(page - 1) * parseInt(limit),
            });

            return {
                data: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalItems: count,
                    totalPages: Math.ceil(count / parseInt(limit)),
                    itemPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < Math.ceil(count / parseInt(limit)),
                    hasPreviousPage: parseInt(page) > 1,
                },
            };
        } catch (error) {
            throw new ApiError('Failed to fetch menu items', 500);
        }
    }

    async deleteMenuItem(menuId) {
        try {
            const deleted = await MenuItem.destroy(menuId);
            if (!deleted) {
                throw new ApiError('Menu item not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete menu item', 500);
        }
    }
}

module.exports = MenuItemRepository;
