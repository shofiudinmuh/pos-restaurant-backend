const ApiError = require('../utils/apiError');
const BaseRepository = require('../repositories/BaseRepository');
const { Op, col } = require('sequelize');

class InventoryRepository extends BaseRepository {
    constructor() {
        super(Inventory);
        this.Ingredient = Ingredient;
        this.InventoryTransaction = InventoryTransaction;
    }

    async update(id, updateStockData, inventoryTransactionData, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const inventory = await this.findById(id, options);
            await inventory.update(updateStockData, options);

            const inventoryTransaction = await this.InventoryTransaction.create(
                inventoryTransactionData,
                options
            );
            return inventoryTransaction;
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to update inventory stock', 500);
        }
    }

    async getAll(options = {}) {
        try {
            return await this.findAll(options);
        } catch (error) {
            throw new ApiError('Failed to fetc menu ingredient', 500);
        }
    }

    async getById(id) {
        try {
            return await this.findById(id);
        } catch (error) {
            throw new ApiError('Failed to fetc menu ingredient', 500);
        }
    }

    async delete(id, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const menuIngredient = await this.findById(id, options);

            await menuIngredient.destroy(options);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete menu ingredient', 500);
        }
    }

    async getLowStock(outletId) {
        try {
            return await super.findAndCountAll({
                where: { outlet_id: outletId },
                include: [
                    {
                        model: this.Inventory,
                        as: 'Inventory',
                        where: {
                            quantity: {
                                [Op.lt]: col('Ingredient.minimum_stock'),
                            },
                        },
                        attributes: ['quantity'],
                        required: true,
                    },
                ],
                order: [['name', 'ASC']],
            });
        } catch (error) {
            throw new ApiError('Failed to fetch low stock', 500);
        }
    }
}

module.exports = InventoryRepository;
