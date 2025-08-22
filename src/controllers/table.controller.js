const TableService = require('../services/table.service');
const TableDto = require('../dtos/tableDto');
const ActivityLogService = require('../services/activity-log.service');
const ApiResponse = require('../utils/responseHandler');

class TableController {
    constructor() {
        this.tableService = new TableService();
        this.activityLogService = new ActivityLogService();
        this.createTable = this.createTable.bind(this);
        this.getTableById = this.getTableById.bind(this);
        this.getTables = this.getTables.bind(this);
        this.updateTable = this.updateTable.bind(this);
        this.deleteTable = this.deleteTable.bind(this);
    }

    /**
     * Create a new table number
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async createTable(req, res, next) {
        try {
            const tableData = TableDto.createTableDto(req);
            const table = await this.tableService.createTable(tableData);

            await this.activityLogService.logActivity(
                userId,
                'create_table',
                'tables',
                table.table_id,
                `Created table ${table.table_id}`
            );
            ApiResponse.success(res, table, 'Table created successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get table number by ID
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getTableById(req, res, next) {
        try {
            const table = await this.tableService.getTableById(req.params.id);
            ApiResponse.success(res, table, 'Table retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get paginated lists of tables
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getTables(req, res, next) {
        try {
            const queryParams = TableDto.tableQueryDto(req.query);
            const result = await this.tableService.getTables(queryParams);
            ApiResponse.success(res, result, 'Tables retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing table
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async updateTable(req, res, next) {
        try {
            const updateData = TableDto.updateTableDto(req);
            const updatedTable = await this.tableService.updateTable(updateData);

            await this.activityLogService.logActivity(
                logData.userId,
                'update_table',
                'tables',
                tableId,
                `Updated table ${tableId}`
            );
            ApiResponse.success(res, updatedTable, 'Table updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete an table
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async deleteTable(req, res, next) {
        try {
            await this.tableService.deleteTable(req.params.id);

            await this.activityLogService.logActivity(
                req.user.user_id,
                'delete_table',
                'tables',
                req.params.id,
                `Deleted table ${req.params.id}`
            );
            ApiResponse.success(res, null, 'Table deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TableController;
// const { Table } = require('../models');
// const activityLogService = require('../services/activityLogService');
// const ApiResponse = require('../utils/responseHandler');
// const { v4: uuidv4 } = require('uuid');

// exports.createTable = async (req, res, next) => {
//     const transaction = await Table.sequelize.transaction();
//     try {
//         const { outlet_id } = req.user;
//         const { table_number, capacity, table_category_id, status } = req.body;

//         const table = await Table.create(
//             {
//                 table_id: uuidv4(),
//                 outlet_id,
//                 table_number,
//                 capacity,
//                 table_category_id,
//                 status,
//             },
//             { transaction }
//         );

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'create_table',
//             'tables',
//             table.table_id,
//             `Created table number : ${table_number}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, table, 'Table number created successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.getTables = async (req, res, next) => {
//     try {
//         const { outlet_id } = req.user;
//         const { page = 1, limit = 10, sort = 'asc', sortBy = 'table_number' } = req.query;
//         const offset = (page - 1) * limit;

//         const tables = await Table.findAndCountAll({
//             where: { outlet_id: outlet_id },
//             include: ['TableCategory'],
//             attributes: ['table_id', 'table_number', 'capacity', 'table_category_id', 'status'],
//             order: [[sortBy, sort]],
//             limit,
//             offset,
//         });

//         return ApiResponse.success(
//             res,
//             {
//                 tables: tables.rows,
//                 pagination: {
//                     total: tables.count,
//                     page,
//                     limit,
//                     totalPage: Math.ceil(tables.count / page),
//                 },
//             },
//             'Table number retrieved successfully'
//         );
//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateTables = async (req, res, next) => {
//     const transaction = await Table.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;
//         const { table_number, capacity, table_category_id, status } = req.body;

//         const table = await Table.findOne({
//             where: { table_id: id, outlet_id: outlet_id },
//         });

//         if (!table) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Table number not found', 404);
//         }

//         await table.update(
//             {
//                 outlet_id,
//                 table_number,
//                 capacity,
//                 table_category_id,
//                 status,
//             },
//             { transaction }
//         );

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'update_table_number',
//             'tables',
//             id,
//             `Updated table number : ${table_number}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, table, 'Table number updated successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.deleteTable = async (req, res, next) => {
//     const transaction = await Table.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;

//         const table = await Table.findOne({
//             where: { table_id: id, outlet_id: outlet_id },
//         });

//         if (!table) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Table number not found', 404);
//         }

//         await table.destroy({ transaction });

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'delete_table_number',
//             'tables',
//             id,
//             `Deleted table number : ${table.table_number}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, null, 'Table number deleted successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };
