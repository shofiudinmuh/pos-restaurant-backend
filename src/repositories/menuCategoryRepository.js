const { Op } = require('sequelize');
const MenuCategories = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class MenuCategoryRepository {
    async createMenuCategory({ outletId, menuCategoryName, menuCategoryDesc }) {
        try {
            return await MenuCategories.create({
                category_id: uuidv4(),
                outletId,
                menuCategoryName,
                menuCategoryDesc,
            });
        } catch (error) {
            throw new ApiError('Failed to create menu category', 500);
        }
    }

    async updateMenuCategory(categoryId, { menuCategoryName, menuCategoryDesc }) {
        try {
            const updateData = {};
            if (menuCategoryName && !undefined) updateData.catagory_name = menuCategoryName;
            if (menuCategoryDesc && !undefined) updateData.description = menuCategoryDesc;

            if (Object.keys(updateData).length === 0) {
                throw new ApiError('No field to update', 400);
            }

            const [updated] = await MenuCategories.update(updateData, {
                where: { category_id: categoryId },
                returning: true,
            });

            if (!updated) {
                throw new ApiError('Menu category not found', 404);
            }

            return await MenuCategories.findByPk(categoryId);
        } catch (error) {
            throw new ApiError('Failed to update menu category', 500);
        }
    }

    async getMenuCategoryById(categoryId) {
        try {
            return await MenuCategories.findByPk(categoryId);
        } catch (error) {
            throw new ApiError('Failed to retireved menu category', 500);
        }
    }

    async getMenuCategories(outletId, options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'category_name',
                sortOrder = 'ASC',
                search,
                searchField = 'category_name',
            } = options;
            const where = { outlet_id: outletId };

            if (search) {
                where[searchField] = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const { count, rows } = await MenuCategories.findAndCountAll({
                where,
                orderBy: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(page - 1) / parseInt(limit),
            });

            return {
                data: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalItems: count,
                    totalPage: Math.ceil(count / parseInt(limit)),
                    itemPerPage: parseInt(limit),
                    hasNextPage: parseInt(page) < Math.ceil(count / parseInt(limit)),
                    hasPreviousPage: parseInt(page) > 1,
                },
            };
        } catch (error) {
            throw new ApiError('Failed to fetch menu categories', 500);
        }
    }

    async deleteMenuCategory(categoryId) {
        try {
            const deleted = await MenuCategories.destroy(categoryId);
            if (!deleted) {
                throw new ApiError('Menu category not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : ApiError('Failed to delete menu category', 500);
        }
    }
}

module.exports = MenuCategoryRepository;
