const TableRepository = require('../repositories/tableRepository');
const ApiError = require('../utils/apiError');

class TableService {
    constructor() {
        this.tableRepository = new TableRepository();
    }

    async createTable({ outletId, tableNumber, tableCapacity, tableCategoryId, tableStatus }) {
        try {
            return await this.tableRepository.createTable({
                outletId,
                tableNumber,
                tableCapacity,
                tableCategoryId,
                tableStatus,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateTable(tableId, { tableNumber, tableCapacity, tableCategoryId, tableStatus }) {
        try {
            return await this.tableRepository.updateTable(tableId, {
                tableNumber,
                tableCapacity,
                tableCategoryId,
                tableStatus,
            });
        } catch (error) {
            throw error;
        }
    }

    async getTableById(tableId) {
        const tableNumber = await this.tableRepository.getTableById(tableId);
        if (!tableNumber) {
            throw new ApiError('Table number not found', 404);
        }
        return tableNumber;
    }

    async getTables(queryParams) {
        this.validatePagination(queryParams);
        return this.tableRepository.getTables(queryParams);
    }

    async deleteTable(tableId) {
        return await this.tableRepository.deleteTable(tableId);
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

module.exports = TableService;
