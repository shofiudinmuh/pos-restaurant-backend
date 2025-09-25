const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');
const BaseRepository = require('../repositories/BaseRepository');

class IngredientRepository extends BaseRepository {
    constructor() {
        super(Ingredient);
        this.Inventory = Inventory;
    }

    async create(ingredientData, inventoryData, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const ingredient = await this.create(ingredientData, options);
            await this.Inventory.create(inventoryData, options);

            return ingredient;
        } catch (error) {
            throw new ApiError('Failed to create ingredient with inventory', 500);
        }
    }

    async update(id, updateData, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const ingredient = await this.findById(id, options);

            await ingredient.update(updateData, options);
            return ingredient;
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to update ingredient', 500);
        }
    }

    async getById(id) {
        try {
            return await this.findById(id);
        } catch (error) {
            throw new ApiError('Failed to fetch ingredient', 500);
        }
    }
    async getAll(options = {}) {
        try {
            return await this.findAll(options);
        } catch (error) {
            throw new ApiError('Failed to fetch ingredients', 500);
        }
    }

    async delete(id, transaction = null) {
        const options = transaction ? { transaction } : {};

        try {
            const ingredient = await this.findById(id, options);

            await this.Inventory.destroy({
                where: { ingredient_id: id },
                ...options,
            });

            await ingredient.destroy(options);
        } catch (error) {
            throw error instanceof ApiError
                ? error
                : new ApiError('Failed to delete ingredient', 500);
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
                                [Op.lt]: this.models.sequelize.col('Ingredient.minimum_stock'),
                            },
                        },
                        attributes: ['quantity'],
                        required: true,
                    },
                ],
                order: [['name', 'ASC']],
            });
        } catch (error) {
            throw new ApiError('Failed to fetch low stock of ingredients', 500);
        }
    }
}
module.exports = IngredientRepository;
// const { Op } = require('sequelize');
// const { Ingredient, Inventory } = require('../models');
// const ApiError = require('../utils/apiError');
// const { v4: uuidv4 } = require('uuid');

// class IngredientRepository {
//     async createIngredient({ outletId, ingredientName, ingredientUnit, ingredientMinimumStock }) {
//         try {
//             return await Ingredient.create({
//                 ingredient_id: uuidv4(),
//                 outletId,
//                 ingredientName,
//                 ingredientUnit,
//                 ingredientMinimumStock,
//             });
//         } catch (error) {
//             throw new ApiError('Failed to create ingredient', 500);
//         }
//     }

//     async updateIngredient(
//         ingredientId,
//         { ingredientName, ingredientUnit, ingredientMinimumStock }
//     ) {
//         try {
//             const updateData = {};
//             if (ingredientName !== undefined) updateData.name = ingredientName;
//             if (ingredientUnit !== undefined) updateData.unit = ingredientUnit;
//             if (ingredientMinimumStock !== undefined)
//                 updateData.minimum_stock = ingredientMinimumStock;

//             if (Object.keys(updateData).length === 0) {
//                 throw new ApiError('No fields to update', 400);
//             }

//             const [updated] = await Ingredient.update(updateData, {
//                 where: { ingredient_id: ingredientId },
//                 returning: true,
//             });

//             if (!updated) {
//                 throw new ApiError('Ingredient not found', 404);
//             }

//             return await Ingredient.findByPk(ingredientId);
//         } catch (error) {
//             throw error instanceof ApiError
//                 ? error
//                 : new ApiError('Failed to update ingredient', 500);
//         }
//     }

//     async getIngredientById(ingredientId) {
//         try {
//             return await Ingredient.findByPk(ingredientId);
//         } catch (error) {
//             throw new ApiError('Failed to fetch ingredient', 500);
//         }
//     }

//     async getIngredients(outletId, options = {}) {
//         try {
//             const {
//                 page = 1,
//                 limit = 10,
//                 sortBy = 'name',
//                 sortOrder = 'ASC',
//                 search = '',
//                 searchField = 'name',
//             } = options;

//             const where = { outlet_id: outletId };
//             if (search) {
//                 where[searchField] = {
//                     [Op.iLike]: `%${search}%`,
//                 };
//             }

//             const { count, rows } = await Ingredient.findAndCountAll({
//                 where,
//                 order: [[sortBy, sortOrder]],
//                 limit: parseInt(limit),
//                 offset: parseInt(page - 1) * parseInt(limit),
//             });

//             return {
//                 data: rows,
//                 pagination: {
//                     currentPage: parseInt(page),
//                     totalItems: count,
//                     totalPages: Math.ceil(count / parseInt(limit)),
//                     itemPerPage: parseInt(limit),
//                     hasNextPage: parseInt(page) < Math.ceil(count / parseInt(limit)),
//                     hasPreviousPage: parseInt(page) > 1,
//                 },
//                 search: {
//                     term: search,
//                     field: searchField,
//                 },
//             };
//         } catch (error) {
//             throw new ApiError('Failed to fetch ingredients', 500);
//         }
//     }

//     async deleteIngredient(ingredientId) {
//         try {
//             const deleted = await Ingredient.destroy(ingredientId);
//             if (!deleted) {
//                 throw new ApiError('Ingredient not found', 404);
//             }
//         } catch (error) {
//             throw error instanceof ApiError
//                 ? error
//                 : new ApiError('Failed to delete ingredient', 500);
//         }
//     }
// }

// module.exports = IngredientRepository;
