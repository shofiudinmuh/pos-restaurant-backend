const BaseRepository = require('../repositories/BaseRepository');
const ApiError = require('../utils/apiError');

class InventoryTransactionRepository extends BaseRepository {
    constructor(InventoryTransaction) {
        this.InventoryTransaction = InventoryTransaction;
    }

    async getById(id) {
        try {
            return await this.findById(id);
        } catch (error) {
            throw new ApiError('Failed to fetch inventory transaction', 500);
        }
    }

    async getAll(options = {}) {
        try {
            return await this.findAll(options);
        } catch (error) {
            throw new ApiError('Failed to fetch inventory transactions', 500);
        }
    }
}

module.exports = InventoryTransactionRepository;
