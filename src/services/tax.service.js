const TaxRepository = require('../repositories/taxRepository');
const ApiError = require('../utils/apiError');

class TaxService {
    constructor() {
        this.taxRepository = new TaxRepository();
    }

    async createTax({ outletId, taxName, taxRate, taxIsActive }) {
        try {
            return await this.taxRepository.createTax({
                outletId,
                taxName,
                taxRate,
                taxIsActive,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateTax(taxId, { taxName, taxRate, taxIsActive }) {
        try {
            return await this.taxRepository.updateTax(taxId, {
                taxName,
                taxRate,
                taxIsActive,
            });
        } catch (error) {
            throw error;
        }
    }

    async getTaxById(taxId) {
        const tax = await this.taxRepository.getTaxById(taxId);
        if (!tax) {
            throw new ApiError('Tax not found', 404);
        }

        return tax;
    }

    async getTaxes(queryParams) {
        this.validatePagination(queryParams);
        return await this.taxRepository.getTaxes(queryParams);
    }

    async deleteTax(taxId) {
        return await this.taxRepository.deleteTax(taxId);
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

module.exports = TaxService;
