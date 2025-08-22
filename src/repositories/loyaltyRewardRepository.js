const { Op } = require('sequelize');
const LoyaltyReward = require('../models');
const ApiError = require('../utils/apiError');
const { v4: uuidv4 } = require('uuid');

class LoyaltyRewardRepository {
    async createLoyaltyReward({
        outletId,
        loyaltyName,
        loyaltyDesc,
        pointRequired,
        loyaltyType,
        loyaltyValue,
        menuId,
        isActive,
    }) {
        try {
            return await LoyaltyReward.create({
                reward_id: uuidv4(),
                outletId,
                loyaltyName,
                loyaltyDesc,
                pointRequired,
                loyaltyType,
                loyaltyValue,
                menuId,
                isActive,
            });
        } catch (error) {
            throw new ApiError('Failed to create loyalty reward', 500);
        }
    }

    async updateLoyaltyReward(
        rewardId,
        { loyaltyName, loyaltyDesc, pointRequired, loyaltyType, loyaltyValue, menuId, isActive }
    ) {
        try {
            const updateData = {};
            if (loyaltyName !== undefined) updateData.name = loyaltyName;
            if (loyaltyDesc !== undefined) updateData.description = loyaltyDesc;
            if (pointRequired !== undefined) updateData.point_required = pointRequired;
            if (loyaltyType !== undefined) updateData.type = loyaltyType;
            if (loyaltyValue !== undefined) updateData.value = loyaltyValue;
            if (menuId !== undefined) updateData.menu_id = menuId;
            if (isActive !== undefined) updateData.is_active = isActive;

            const [updatedCount] = await LoyaltyReward.update(updateData, {
                where: { reward_id: rewardId },
                returning: true,
            });

            if (updatedCount === 0) {
                throw new ApiError('Loyalty reward not found', 404);
            }
            return await LoyaltyReward.findByPk(rewardId);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : ApiError('Failed to update loyalty reward', 500);
        }
    }

    async getLoyaltyRewardById(rewardId) {
        try {
            return await LoyaltyReward.findByPk(rewardId);
        } catch (error) {
            throw new ApiError('Failed to fetch loyalty reward', 500);
        }
    }

    async getLoyaltyRewards(outletId, options = {}) {
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
                    [Op.iLike]: `%${search}`,
                };
            }

            const { count, rows } = await LoyaltyReward.findAndCountAll({
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
            throw new ApiError('Failed to fetch loyalty rewards', 500);
        }
    }

    async deleteLoyaltyReward(rewardId) {
        try {
            const deleted = await LoyaltyReward.destroy(rewardId);
            if (!deleted) {
                throw new ApiError('Loyalty reward not found', 404);
            }
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : ApiError('Failed to delete loyalty reward', 500);
        }
    }
}

module.exports = LoyaltyRewardRepository;
