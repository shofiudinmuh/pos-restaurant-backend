const { Op } = require('sequelize');
const { Taxes } = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class TaxRepository {
    async createTax({ outletId, taxName, taxRate, taxIsActive }) {
        try {
            return await Taxes.create({
                tax_id: uuidv4(),
                outletId,
                taxName,
                taxRate,
                taxIsActive,
            });
        } catch (error) {
            throw new ApiError('Failed to create tax', 500);
        }
    }

    async updateTax(taxId, { taxName, taxRate, taxIsActive }) {
        try {
            const updateData = {};
            if (taxName !== undefined) updateData.name = taxName;
            if (taxRate !== undefined) updateData.rate = taxRate;
            if (taxIsActive !== undefined) updateData.is_active = taxIsActive;

            if (Object.keys(updateData).length === 1) {
                throw new ApiError('No valid field provided for update', 400);
            }

            const [updatedCount] = await Taxes.update(updateData, {
                where: { tax_id: taxId },
                returning: true,
            });

            if (updatedCount === 0) {
                throw new ApiError('Tax not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError ? error : new ApiError('Failed to update tax', 500);
        }
    }

    async getTaxById(taxId) {
        try {
            return await Taxes.findByPk(taxId);
        } catch (error) {
            throw new ApiError('Failed to fetch tax', 500);
        }
    }

    async getTaxes(outletId, options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'name',
                sortOrder = 'ASC',
                search,
                searchField = 'name',
            } = options;

            const where = { outlet_id: outletId };

            if (search) {
                where[searchField] = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const [count, rows] = await Taxes.findAndCountAll({
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
                    itemPerPages: parseInt(limit),
                    hasNexPage: parseInt(page) < Math.ceil(count / parseInt(limit)),
                    hasPreviousPage: parseInt(page) > 1,
                },
            };
        } catch (error) {
            throw new ApiError('Failed to fetch taxes', 500);
        }
    }

    async deleteTax(taxId) {
        try {
            const deleted = await Taxes.destroy(taxId);
            if (!deleted) {
                throw new ApiError('Tax is not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError ? error : new ApiError('Failed to delete tax', 500);
        }
    }
}

module.exports = TaxRepository;
