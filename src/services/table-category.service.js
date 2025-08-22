const TableCategoryRepository = require('../repositories/tableCategoryRepository');
const ApiError = require('../utils/apiError');

class TableCategoryService {
    constructor() {
        this.tableCategoryRepository = new TableCategoryRepository();
    }

    async createTabelCategory({ outletId, categoryName, description }) {
        try {
            return await this.tableCategoryRepository.createTableCategory({
                outletId,
                categoryName,
                description,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateTableCategory(tableCategoryId, { categoryName, description }) {
        try {
            return await this.tableCategoryRepository.updateTableCategory(tableCategoryId, {
                categoryName,
                description,
            });
        } catch (error) {
            throw error;
        }
    }

    async getTableCategoryById(tableCategoryId) {
        const tableCategory = await this.tableCategoryRepository.getTableCategoryById(
            tableCategoryId
        );
        if (!tableCategory) {
            throw new ApiError('Table category not found', 404);
        }
        return tableCategory;
    }

    async getTableCategories(queryParams) {
        this.validatePagination(queryParams);
        return this.tableCategoryRepository.getTableCategory(queryParams);
    }

    async deleteTableCategory(tableCategoryId) {
        return await this.tableCategoryRepository.deleteTableCategory(tableCategoryId);
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

module.exports = TableCategoryService;
