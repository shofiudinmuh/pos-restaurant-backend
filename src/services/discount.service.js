const DiscountRepository = require('../repositories/discountRepository');
const ApiError = require('../utils/apiError');

class DiscountService {
    constructor() {
        this.discountRepository = new DiscountRepository();
    }

    async createDiscount({
        outletId,
        discountName,
        discountType,
        discountValue,
        discountForMemberOnly,
    }) {
        try {
            return await this.discountRepository.createDiscount({
                outletId,
                discountName,
                discountType,
                discountValue,
                discountForMemberOnly,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateDiscount(
        discountId,
        { discountName, discountType, discountValue, discountForMemberOnly }
    ) {
        try {
            return await this.discountRepository.updateDiscount(discountId, {
                discountName,
                discountType,
                discountValue,
                discountForMemberOnly,
            });
        } catch (error) {
            throw error;
        }
    }

    async getDiscountById(discountId) {
        const discount = await this.discountRepository.getDiscountById(discountId);
        if (!discount) {
            throw new ApiError('Discount not found', 404);
        }

        return discount;
    }

    async getDiscounts(queryParams) {
        this.validatePagination(queryParams);
        return this.discountRepository.getDiscounts(queryParams);
    }

    async deleteDiscount(discountId) {
        return await this.discountRepository.deleteDiscount(discountId);
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

module.exports = DiscountService;
