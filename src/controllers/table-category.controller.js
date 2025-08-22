const TableCategoryService = require('../services/table-category.service');
const TableCategoryDto = require('../dtos/tableCategoryDto');
const ApiResponse = require('../utils/responseHandler');

class TableCategoryController {
    constructor(tableCategoryService = new TableCategoryService()) {
        this.tableCategoryService = tableCategoryService;
        this.createTableCategory = this.createTableCategory.bind(this);
        this.getTableCategoryById = this.getTableCategoryById.bind(this);
        this.getTableCategories = this.getTableCategories.bind(this);
        this.updateTableCategory = this.updateTableCategory.bind(this);
        this.deleteTableCategory = this.deleteTableCategory.bind(this);
    }

    /**
     * Create new table category
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async createTableCategory(res, res, next) {
        try {
            const tableCategoryData = TableCategoryDto.createTableCategoryDto(req);
            const tableCategory = await this.tableCategoryService.createTabelCategory(
                tableCategoryData
            );
            ApiResponse.success(res, tableCategory, 'Table category created successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get table category by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getTableCategoryById(req, res, next) {
        try {
            const tableCategory = await this.tableCategoryService.getTableCategoryById(
                req.params.id
            );
            ApiResponse.success(res, tableCategory, 'Table category retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get paginated list of table category
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getTableCategories(req, res, next) {
        try {
            const queryParams = TableCategoryDto.tableCategoryQueryDto(queryParams);
            const result = await this.tableCategoryService.getTableCategories(queryParams);
            ApiResponse.success(res, result, 'Table categories retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing table category
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async updateTableCategory(req, res, next) {
        try {
            const updateData = TableCategoryDto.updateTableCategoryDto(req);
            const updatedData = this.tableCategoryService.updateTableCategory(updateData);
            ApiResponse.success(res, updatedData, 'Table category updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete an table category
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async deleteTableCategory(req, res, next) {
        try {
            await this.tableCategoryService.deleteTableCategory(req.params.id);
            ApiResponse.success(res, null, 'Table category deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TableCategoryController;
// exports.createTableCategory = async (req, res, next) => {
//     const transaction = await TableCategory.sequelize.transaction();
//     try {
//         const { category_name, description } = req.body;
//         const { outlet_id } = req.user;

//         const table = await TableCategory.create(
//             {
//                 table_category_id: uuidv4(),
//                 outlet_id,
//                 category_name,
//                 description,
//             },
//             {
//                 transaction,
//             }
//         );

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'create_table_category',
//             'table_categories',
//             table.table_category_id,
//             `Category table created : ${category_name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, 'Table category created successfully', 200);
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.getTableCategories = async (req, res, next) => {
//     try {
//         const { page = 1, limit = 10, sort = 'asc', sortBy = 'category_name' } = req.query;
//         const offset = (page - 1) * limit;
//         const { outlet_id } = req.user;

//         const tableCategories = await TableCategory.findAndCountAll({
//             where: { outlet_id: outlet_id },
//             attributes: ['category_name', 'description'],
//             order: [[sortBy, sort]],
//             limit,
//             offset,
//         });

//         return ApiResponse.success(res, {
//             tableCategories: tableCategories.rows,
//             pagination: {
//                 total: tableCategories.count,
//                 page,
//                 limit,
//                 totalPage: Math.ceil(tableCategories.count / limit),
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateTableCategory = async (req, res, next) => {
//     const transaction = await TableCategory.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { category_name, description } = req.body;
//         const { outlet_id } = req.user;

//         const tableCategory = await TableCategory.findOne({
//             where: { table_category_id: id, outlet_id: outlet_id },
//         });

//         if (!tableCategory) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Table category not found', 404);
//         }

//         await tableCategory.update({ category_name, description }, { transaction });

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'update_table_category',
//             'table_categories',
//             id,
//             `Updated table category : ${category_name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, tableCategory, 'Table category updated successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.deleteTableCategory = async (req, res, next) => {
//     const transaction = await TableCategory.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;
//         const tableCategory = await TableCategory.findOne({
//             where: { table_category_id: id, outlet_id: outlet_id },
//         });

//         if (!tableCategory) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Table category not found', 404);
//         }

//         await tableCategory.destroy({ transaction });

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'delete_table_category',
//             'table_categories',
//             id,
//             `Deleted table category : ${tableCategory.category_name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, null, 'Table category deleted successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };
