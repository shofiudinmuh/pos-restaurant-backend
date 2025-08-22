const { Op } = require('sequelize');
const { Tables } = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class TableRepository {
    async createTable({ outletId, tableNumber, tableCapacity, tableCategoryId, tableStatus }) {
        try {
            return await Tables.create({
                table_id: uuidv4(),
                outletId,
                tableNumber,
                tableCapacity,
                tableCategoryId,
                tableStatus,
            });
        } catch (error) {
            throw new ApiError('Failed to create table number', 500);
        }
    }

    async updateTable(tableId, { tableNumber, tableCapacity, tableCategoryId, tableStatus }) {
        try {
            const updateData = {};
            if (tableNumber !== undefined) updateData.table_number = tableNumber;
            if (tableCapacity !== undefined) updateData.capacity = tableCapacity;
            if (tableCategoryId !== undefined) updateData.table_category_id = tableCategoryId;
            if (tableStatus !== undefined) updateData.status = tableStatus;

            if (Object.keys(updateData).length === 0) {
                throw new ApiError('No valid fields provided for update', 400);
            }

            const [updatedCount] = await Tables.update(updateData, {
                where: { table_id: tableId },
                returning: true,
            });
            if (updatedCount === 0) {
                throw new ApiError('Table category not found', 404);
            }

            return await Tables.findByPk(tableId);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to update table number', 500);
        }
    }

    async getTableById(tableId) {
        try {
            return await Tables.findByPk(tableId);
        } catch (error) {
            throw new ApiError('Failed to fetch table number', 500);
        }
    }

    async getTables(outletId, options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'table_number',
                sortOrder = 'ASC',
                search,
                searchField = 'table_number',
            } = options;
            const where = { outlet_id: outletId };

            if (search) {
                where[searchField] = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const { count, rows } = await Tables.findAndCountAll({
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
            throw new ApiError('Failed to fetch table number', 500);
        }
    }

    async deleteTable(tableId) {
        try {
            const deleted = await Tables.destroy(tableId);
            if (!deleted) {
                throw new ApiError('Table number not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete table number', 500);
        }
    }
}

module.exports = TableRepository;
