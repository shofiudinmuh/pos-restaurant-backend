const { v4: uuidv4 } = require('uuid');

class IngredientService {
    constructor(ingredientRepository, activityLogService) {
        this.ingredientRepository = ingredientRepository;
        this.activityLogService = activityLogService;
    }

    async createIngredient(createDto) {
        const transaction = await this.ingredientRepository.getSequelizeInstance().transaction();

        try {
            //ingredient data
            const ingredientId = uuidv4();
            const ingredientData = {
                ingredient_id: ingredientId,
                ...createDto.toEntity(),
            };

            //inventory data
            const inventoryId = uuidv4();
            const inventoryData = {
                inventory_id: inventoryId,
                ...createDto.toInventoryEntity(ingredientId),
            };

            const ingredient = await this.ingredientRepository.create(
                ingredientData,
                inventoryData,
                { transaction }
            );

            //create log activity
            const logData = createDto.toLogEntity();
            await this.activityLogService.logActivity(logData, { transaction });

            await transaction.commit();
            return ingredient;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateIngredient(id, updateDto) {
        const transaction = await this.ingredientRepository.getSequelizeInstance().transaction();

        try {
            const ingredient = await this.ingredientRepository.update(id, ...updateDto.toEntity(), {
                transaction,
            });

            const logData = updateDto.toLogEntity(id, ingredient.name);
            await this.activityLogService.logActivity(logData, { transaction });

            await transaction.commit();
            return ingredient;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteIngredient(deleteDto) {
        const transaction = await this.ingredientRepository.getSequelizeInstance().transaction();

        try {
            const ingredient = await this.ingredientRepository.getById(deleteDto.ingredient_id);
            await this.ingredientRepository.delete(deleteDto.ingredient_id, { transaction });

            const logData = deleteDto.toLogEntity(ingredient.name);
            await this.activityLogService.logActivity(logData, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getIngredientById(id) {
        try {
            return await this.ingredientRepository.getById(id);
        } catch (error) {
            throw error;
        }
    }

    async getIngredients(outletId, queryParams) {
        try {
            return await this.ingredientRepository.getAll(outletId, queryParams);
        } catch (error) {
            throw error;
        }
    }

    async getLowStockIngredient(outletId) {
        try {
            return await this.ingredientRepository.getLowStock(outletId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = IngredientService;
// const IngredientRepository = require('../repositories/ingredientRepository');
// const ApiError = require('../utils/apiError');

// class IngredientService {
//     constructor() {
//         this.ingredientRepository = new IngredientRepository();
//     }

//     validatePagination({ page, limit }) {
//         if (page && isNaN(page)) {
//             throw new ApiError('Invalid page number', 400);
//         }

//         if (limit && isNaN(limit)) {
//             throw new ApiError('Invalid limit value', 400);
//         }
//     }

//     async createIngredient({ outletId, ingredientName, ingredientUnit, ingredientMinimumStock }) {
//         try {
//             return await this.ingredientRepository.createIngredient({
//                 outletId,
//                 ingredientName,
//                 ingredientUnit,
//                 ingredientMinimumStock,
//             });
//         } catch (error) {
//             throw error;
//         }
//     }

//     async updateIngredient(
//         ingredientId,
//         { ingredientName, ingredientUnit, ingredientMinimumStock }
//     ) {
//         try {
//             return await this.ingredientRepository.updateIngredient(ingredientId, {
//                 ingredientName,
//                 ingredientUnit,
//                 ingredientMinimumStock,
//             });
//         } catch (error) {
//             throw error;
//         }
//     }

//     async getIngredientById(ingredientId) {
//         const ingredient = await this.ingredientRepository.getIngredientById(ingredientId);
//         if (!ingredient) {
//             throw new ApiError('Ingredient not found', 404);
//         }

//         return ingredient;
//     }

//     async getIngredients(queryParams) {
//         this.validatePagination(queryParams);
//         return await this.ingredientRepository.getIngredients(queryParams);
//     }

//     async deleteIngredient(ingredientId) {
//         return await this.ingredientRepository.deleteIngredient(ingredientId);
//     }
// }

// module.exports = IngredientService;
