const { Op } = require('sequelize');
const { TableCategory } = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class TableCategoryRepository {
    async createTableCategory({ outletId, categoryName, description }) {
        try {
            return await TableCategory.create({
                table_category_id: uuidv4(),
                outletId,
                categoryName,
                description,
            });
        } catch (error) {
            throw new ApiError('Failed to create table category', 500);
        }
    }

    async updateTableCategory(tableCategoryId, { categoryName, description }) {
        try {
            const updateData = {};
            if (categoryName !== undefined) updateData.category_name = categoryName;
            if (description !== undefined) updateData.description = description;

            if (Object.keys(updateData).length === 0) {
                throw new ApiError('No fields to update', 400);
            }

            const [updated] = await TableCategory.update(updateData, {
                where: { table_category_id: tableCategoryId },
                returning: true,
            });
            if (!updated) {
                throw new ApiError('Table category not found', 404);
            }

            return await TableCategory.findByPk(tableCategoryId);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to update table category', 500);
        }
    }

    async getTableCategoryById(tableCategoryId) {
        try {
            return await TableCategory.findByPk(tableCategoryId);
        } catch (error) {
            throw new ApiError('Failed to fetch table category', 500);
        }
    }

    async getTableCategory(outletId, options = {}) {
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

            const { count, rows } = await TableCategory.findAndCountAll({
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
                    itemPerpage: parseInt(limit),
                    hasNextPage: parseInt(page) < Math.ceil(count / parseInt(limit)),
                    hasPreviousPage: parseInt(page) > 1,
                },
            };
        } catch (error) {
            throw new ApiError('Failed to fetch table category', 500);
        }
    }

    async deleteTableCategory(tableCategoryId) {
        try {
            const deleted = await TableCategory.destroy(tableCategoryId);
            if (!deleted) {
                throw new ApiError('Table category not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete table category', 500);
        }
    }
}

module.exports = TableCategoryRepository;
