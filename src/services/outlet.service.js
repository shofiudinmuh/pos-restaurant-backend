const OutletRepository = require('../repositories/outletRepository');
const StorageService = require('../services/storageService');
const ApiError = require('../utils/apiError');

class OutletService {
    constructor() {
        this.outletRepository = new OutletRepository();
        this.storageService = new StorageService();
    }

    async createOutlet({ name, address, phone, outletCode, file }) {
        try {
            const logoUrl = file
                ? await this.storageService.uploadFile(file, 'outlet_logos')
                : null;
            return await this.outletRepository.createOutlet({
                name,
                address,
                phone,
                outletCode,
                logoUrl,
            });
        } catch (error) {
            if (file) {
                await this.storageService.deleteFile(await this.storageService.getFileKey(file));
            }
            throw error;
        }
    }

    async updateOutlet(outletId, { name, address, phone, outletCode, file }) {
        const outlet = await this.getOutletById(outletId);
        let logoUrl = outlet.logo_url;

        try {
            if (file) {
                if (logoUrl) {
                    await this.storageService.deleteFile(logoUrl);
                }
                logoUrl = await this.storageService.uploadFile(file, 'outlet_logos');
            }

            return await this.outletRepository.updateOutlet(outletId, {
                name,
                address,
                phone,
                outletCode,
                logoUrl,
            });
        } catch (error) {
            if (file && logoUrl) {
                await this.storageService.deleteFile(logoUrl);
            }
            throw error;
        }
    }

    async getOutlet(queryParams) {
        this.validatePagination(queryParams);
        return this.outletRepository.getOutlets(queryParams);
    }

    async getOutletById(outletId) {
        const outlet = await this.outletRepository.getOutletById(outletId);
        if (!outlet) {
            throw new ApiError('Outlet not found', 404);
        }
        return outlet;
    }

    async deleteOutlet(outletId) {
        const outlet = await this.getOutletById(outletId);

        if (outlet.logo_url) {
            await this.storageService.deleteFile(outlet.logo_url);
        }
        return this.outletRepository.deleteOutlet(outletId);
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

module.exports = OutletService;
