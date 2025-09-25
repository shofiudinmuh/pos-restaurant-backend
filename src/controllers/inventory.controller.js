const ApiResponse = require('../utils/responseHandler');
const DeleteInventoryDto = require('../dtos/inventory/DeleteInventoryDto');
const InventoryResponseDto = require('../dtos/inventory/InventoryResponseDto');
const InventoryQueryDto = require('../dtos/inventory/InventoryQueryDto');
const UpdateStockDto = require('../dtos/inventory/UpdateStockDto');

class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }

    async updateInventory(req, res, next) {
        try {
            const updateDto = UpdateStockDto.formRequest(req);
            const { id } = req.params;
            const updated = await this.inventoryService.updateStock(id, updateDto);

            const responseData = InventoryResponseDto.formEntity(updated);
            return ApiResponse.success(res, responseData, 'Inventory updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async getInventories(req, res, next) {
        try {
            const queryDto = InventoryQueryDto.formRequest(req);
            const result = await this.inventoryService.getInventories(queryDto);

            const responseData = InventoryResponseDto.formEntities(result);
            return ApiResponse.success(res, responseData, 'Inventories retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    async getInventoryById(req, res, next) {
        try {
            const id = req.params;
            const inventory = await this.inventoryService.getInventoryById(id);

            const responseData = InventoryResponseDto.formEntity(inventory);
            return ApiResponse.success(res, responseData, 'Iventory retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    async getLowStock(req, res, next) {
        try {
            const queryDto = InventoryQueryDto.formRequest(req);
            const result = await this.inventoryService.getLowStock(queryDto);

            const responseData = InventoryResponseDto.formEntities(result);
            return ApiResponse.success(
                res,
                responseData,
                'Low stock of inventory retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }
    async deleteInventory(req, res, next) {
        try {
            const deleteDto = DeleteInventoryDto.formRequest(req);
            await this.inventoryService.deleteInventory(deleteDto);

            return ApiResponse.success(res, null, 'Inventory deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InventoryController;
