const LoyaltyRewardRepository = require('../repositories/loyaltyRewardRepository');
const ApiError = require('../utils/apiError');

class LoyaltyRewardService {
    constructor() {
        this.loyaltyRewardRepository = new LoyaltyRewardRepository();
    }

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
            return await this.loyaltyRewardRepository.createLoyaltyReward({
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
            throw error;
        }
    }

    async updateLoyaltyReward(
        rewardId,
        { loyaltyName, loyaltyDesc, pointRequired, loyaltyType, loyaltyValue, menuId, isActive }
    ) {
        try {
            return await this.loyaltyRewardRepository.updateLoyaltyReward(rewardId, {
                loyaltyName,
                loyaltyDesc,
                pointRequired,
                loyaltyType,
                loyaltyValue,
                menuId,
                isActive,
            });
        } catch (error) {
            throw error;
        }
    }

    async getLoyaltyById(rewardId) {
        const loyaltyReward = await this.loyaltyRewardRepository.getLoyaltyRewardById(rewardId);
        if (!loyaltyReward) {
            throw new ApiError('Loyalty reward not found', 404);
        }

        return loyaltyReward;
    }

    async getLoyaltyRewards(queryParams) {
        this.validatePagination(queryParams);
        return this.loyaltyRewardRepository.getLoyaltyRewards(queryParams);
    }

    async deleteLoyaltyReward(rewardId) {
        return await this.loyaltyRewardRepository.deleteLoyaltyReward(rewardId);
    }

    validatePagination({ page, limit }) {
        if (page && isNaN(page)) {
            throw new ApiError('Invalid page number', 400);
        }
        if (limit && isNaN(limit)) {
            throw new ApiError('Invalid limit value', 400);
        }
    }
}

module.exports = LoyaltyRewardService;
