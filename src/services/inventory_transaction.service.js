class InventoryTransactionService {
    constructor(inventoryTransactionRepository) {
        this.inventoryTransactionRepository = inventoryTransactionRepository;
    }

    async getInventoryTransaction(id) {
        try {
            return await this.inventoryTransactionRepository.getById(id);
        } catch (error) {
            throw error;
        }
    }

    async getInventoryTransactions(outletId, queryParams) {
        try {
            return await this.inventoryTransactionRepository.getAll(outletId, queryParams);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = InventoryTransactionService;
