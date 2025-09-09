const MenuCategoryRepository = require('../repositories/menuCategoryRepository');
const ApiError = require('../utils/apiError');

class MenuCategoryService {
    constructor() {
        this.menuCategoryRepository = new MenuCategoryRepository();
    }

    async createMenuCategory({ outletId, menuCategoryName, menuCategoryDesc }) {
        try {
            return await this.menuCategoryRepository.createMenuCategory({
                outletId,
                menuCategoryName,
                menuCategoryDesc,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateMenuCategory(categoryId, { menuCategoryName, menuCategoryDesc }) {
        try {
            return await this.menuCategoryRepository.updateMenuCategory(categoryId, {
                menuCategoryName,
                menuCategoryDesc,
            });
        } catch (error) {
            throw error;
        }
    }

    async getMenuCategoryById(categoryId) {
        const menuCategory = await this.menuCategoryRepository.getMenuCategoryById(categoryId);
        if (!menuCategory) {
            throw new ApiError('Menu category not found', 404);
        }

        return menuCategory;
    }

    async getMenuCategories(queryParams) {
        this.validatePagination(queryParams);
        return this.menuCategoryRepository.getMenuCategories(queryParams);
    }

    async deleteMenuCategory(categoryId) {
        return await this.menuCategoryRepository.deleteMenuCategory(categoryId);
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

module.exports = MenuCategoryService;
