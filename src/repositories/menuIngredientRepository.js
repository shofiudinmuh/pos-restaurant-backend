const ApiError = require('../utils/apiError');
const BaseRepository = require('./BaseRepository');

class MenuIngredientRepository extends BaseRepository {
    constructor() {
        super(MenuIngredient);
    }

    async create(menuIngredientData, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const menuIngredient = await this.create(menuIngredientData, options);
            return menuIngredient;
        } catch (error) {
            throw new ApiError('Failed to create menu ingredient', 500);
        }
    }

    async getAll(options = {}) {
        try {
            return await this.findAll(options);
        } catch (error) {
            throw new ApiError('Failed to fetch menu ingredients', 500);
        }
    }

    async getById(id) {
        try {
            return await this.findById(id);
        } catch (error) {
            throw new ApiError('Failed to fetch menu ingredient', 500);
        }
    }

    async update(id, updateData, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const menuIngredient = await this.findById(id, options);
            await menuIngredient.update(updateData, options);

            return menuIngredient;
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to update menu ingredient', 500);
        }
    }

    async delete(id, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const menuIngredient = await this.findById(id, options);
            await menuIngredient.destroy(id, options);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete menu ingredient', 500);
        }
    }
}

module.exports = MenuIngredientRepository;
