const { v4: uuidv4 } = require('sequelize');
const ApiError = require('../utils/apiError');

class InventoryService {
    constructor(inventoryRepository, activityLogService) {
        this.inventoryRepository = inventoryRepository;
        this.activityLogService = activityLogService;
    }

    async updateInventory(id, updateDto) {
        const transaction = await this.inventoryRepository.getSequelizeInstance().transaction();

        try {
            const inventory = await this.inventoryRepository.getById(id);

            // calculate new quantity
            const updateData = { ...updateDto.toEntity() };

            let newQuantity;
            switch (updateData.trasaction_type) {
                case 'add':
                    newQuantity = inventory.quantity + updateDto.quantity;
                    break;
                case 'remove':
                    newQuantity = inventory.quantity - updateDto.quantity;
                    break;
                case 'adjust':
                    newQuantity = updateDto.quantity;
                    break;
                default:
                    throw new ApiError('Invallid transaction type', 400);
            }

            if (newQuantity < 0) {
                throw new ApiError('Insufficient stock', 400);
            }

            const updateStockData = { quantity: newQuantity };

            const inventoryTransactionData = {
                inventory_transaction_id: uuidv4(),
                ...updateDto.toTransactionEntity(id),
            };
            const inventoryUpdate = await this.inventoryRepository.update(
                id,
                updateStockData,
                inventoryTransactionData,
                transaction
            );

            const logData = updateDto.toLogEntity();
            await this.activityLogService.logActivity(logData, { transaction });
            await transaction.commit();

            return inventoryUpdate;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getInventories(outletId, queryParams) {
        try {
            return await this.inventoryRepository.getAll(outletId, queryParams);
        } catch (error) {
            throw error;
        }
    }

    async getInventoryById(id) {
        try {
            return await this.inventoryRepository.getById(id);
        } catch (error) {
            throw error;
        }
    }

    async deleteInventory(deleteDto) {
        const transaction = await this.inventoryRepository.getSequelizeInstance().transaction();

        try {
            await this.inventoryRepository.delete(deleteDto.inventory_id);

            const logData = deleteDto.toLogEntity();
            await this.activityLogService.logActivity(logData, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getLowStockInventory(outletId) {
        try {
            return await this.inventoryRepository.getLowStockInventory(outletId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = InventoryService;
