const { v4: uuidv4 } = require('uuid');

class MenuIngredientService {
    constructor(menuIngredientRepository, activityLogService) {
        this.menuIngredientRepository = menuIngredientRepository;
        this.activityLogService = activityLogService;
    }

    async createMenuIngredient(createDto) {
        const transaction = await this.menuIngredientRepository
            .getSequelizeInstance()
            .transaction();

        try {
            const menuIngredientId = uuidv4();
            const menuIngredientData = {
                menuIngredientId,
                ...createDto.toEntity(),
            };

            const menuIngredient = await this.menuIngredientRepository.create(menuIngredientData, {
                transaction,
            });

            const logData = createDto.toLogEntity();
            await this.activityLogService.logActivity(logData, { transaction });

            await transaction.commit();
            return menuIngredient;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateMenuIngredient(id, updateDto) {
        const transaction = await this.menuIngredientRepository
            .getSequelizeInstance()
            .transaction();

        try {
            const menuIngredient = await this.menuIngredientRepository.update(
                id,
                ...updateDto.toEntity(),
                {
                    transaction,
                }
            );

            const logData = updateDto.toLogEntity(id, menuIngredient.menu_id);
            await this.activityLogService.logActivity(logData, { transaction });

            await transaction.commit();
            return menuIngredient;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteMenuIngredient(deleteDto) {
        const transaction = await this.menuIngredientRepository
            .getSequelizeInstance()
            .transaction();

        try {
            const menuIngredient = await this.menuIngredientRepository.getById(
                deleteDto.menu_ingredient_id
            );
            await this.menuIngredientRepository.delete(deleteDto.menu_ingredient_id, {
                transaction,
            });

            const logData = deleteDto.toLogEntity(menuIngredient.menu.id);
            await this.activityLogService.logActivity(logData, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getMenuIngredientById(id) {
        try {
            return await this.menuIngredientRepository.getById(id);
        } catch (error) {
            throw error;
        }
    }

    async getMenuIngredients(outletId, queryParams) {
        try {
            return await this.menuIngredientRepository.getAll(outletId, queryParams);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MenuIngredientService;
