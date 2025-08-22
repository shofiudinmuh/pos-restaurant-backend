const { Op } = require('sequelize');
const { Discounts } = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class DiscountRepository {
    async createDiscount({
        outletId,
        discountName,
        discountType,
        discountValue,
        discountForMemberOnly,
    }) {
        try {
            return await Discounts.create({
                discount_id: uuidv4(),
                outletId,
                discountName,
                discountType,
                discountValue,
                discountForMemberOnly,
            });
        } catch (error) {
            throw new ApiError('Failed to create discount', 500);
        }
    }

    async updateDiscount(
        discountId,
        { discountName, discountType, discountValue, discountForMemberOnly }
    ) {
        try {
            const updateData = {};
            if (discountName !== undefined) updateData.name = discountName;
            if (discountType !== undefined) updateData.type = discountType;
            if (discountValue !== undefined) updateData.value = discountValue;
            if (discountForMemberOnly !== undefined)
                updateData.is_member_only = discountForMemberOnly;

            if (Object.keys(updateData).length === 0) {
                throw new ApiError('No valid fields provided for update', 400);
            }

            const [updatedCount] = await Discounts.update(updateData, {
                where: { discount_id: discountId },
                returning: true,
            });
            if (updatedCount === 0) {
                throw new ApiError('Discount not found', 404);
            }

            return await Discounts.findByPk(discountId);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to update discount', 500);
        }
    }

    async getDiscountById(discountId) {
        try {
            return await Discounts.findByPk(discountId);
        } catch (error) {
            throw new ApiError('Failed to fetch discount', 500);
        }
    }

    async getDiscounts(outletId, options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sortBy = 'name',
                sortOrder = 'ASC',
                search,
                searchField = 'name',
            } = options;

            where = { outlet_id: outletId };
            if (search) {
                where[searchField] = {
                    [Op.iLike]: `%${search}%`,
                };
            }

            const { count, rows } = await Discounts.findAndCountAll({
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
            throw new ApiError('Failed to fetch discount', 500);
        }
    }

    async deleteDiscount(discountId) {
        try {
            const deleted = await Discounts.destroy(discountId);
            if (!deleted) {
                throw new ApiError('Discount not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete discount', 500);
        }
    }
}

module.exports = DiscountRepository;
