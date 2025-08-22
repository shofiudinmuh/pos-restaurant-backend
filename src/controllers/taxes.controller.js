const TaxService = require('../services/tax.service');
const TaxDto = require('../dtos/taxDto');
const ActivityLogService = require('../services/activity-log.service');
const ApiResponse = require('../utils/responseHandler');

class TaxController {
    constructor() {
        this.taxService = new TaxService();
        this.activityLogService = new ActivityLogService();
    }

    /**
     * Create a new tax
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async createTax(req, res, next) {
        try {
            const taxData = TaxDto.createTaxDto(req);
            const tax = await this.taxService.createTax(taxData);

            await this.activityLogService.logActivity(
                userId,
                'create_tax',
                'taxes',
                tax.tax_id,
                `Created tax ${tax.tax_id}`
            );
            ApiResponse.success(res, tax, 'Tax created successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get tax by ID
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getTaxById(req, res, next) {
        try {
            const tax = await this.taxService.getTaxById(req.params.id);
            ApiResponse.success(res, tax, 'Tax retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get taxes
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async getTaxes(req, res, next) {
        try {
            const queryParams = TaxDto.taxQueryDto(req.query);
            const result = await this.taxService.getTaxes(queryParams);
            ApiResponse.success(res, result, 'Tax created successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update tax
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async updateTax(req, res, next) {
        try {
            const updateData = TaxDto.updateTaxDto(req);
            const updatedTax = await this.taxService.updateTax(updateData);

            await this.activityLogService.logActivity(
                userId,
                'update_tax',
                'taxes',
                taxId,
                `Updated tax ${taxId}`
            );
            ApiResponse.success(res, updatedTax, 'Tax updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete tax
     * @param {Object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware
     */
    async deleteTax(req, res, next) {
        try {
            await this.taxService.deleteTax(req.params.id);

            await this.activityLogService.logActivity(
                req.user.user_id,
                'delete_tax',
                'taxes',
                req.params.id,
                `Deleted tax ${req.params.id}`
            );
            ApiResponse.success(res, null, 'Tax deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TaxController;
// const { Taxes } = require('../models');
// const activityLogService = require('../services/activity-log.service');
// const ApiResponse = require('../utils/responseHandler');
// const { v4: uuidv4 } = require('uuid');

// exports.createTax = async (req, res, next) => {
//     const transaction = await Taxes.sequelize.transaction();
//     try {
//         const { outlet_id } = req.user;
//         const { name, rate, is_active } = req.body;

//         const tax = await Taxes.create(
//             {
//                 tax_id: uuidv4(),
//                 outlet_id,
//                 name,
//                 rate,
//                 is_active,
//             },
//             {
//                 transaction,
//             }
//         );

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'create_tax',
//             'taxes',
//             tax.tax_id,
//             `Created tax : ${name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, tax, 'Tax created successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.getTaxes = async (req, res, next) => {
//     try {
//         const { outlet_id } = req.user;
//         const { page = 1, limit = 10, sort = 'asc', sortBy = 'created_at' } = req.query;
//         const offset = (page - 1) * limit;

//         const taxes = await Taxes.findAndCountAll({
//             where: { outlet_id: outlet_id },
//             order: [[sortBy, sort]],
//             limit,
//             offset,
//         });

//         return ApiResponse.success(
//             res,
//             {
//                 taxes: taxes.rows,
//                 pagination: {
//                     total: taxes.count,
//                     limit,
//                     offset,
//                     totalPage: Math.ceil(taxes.count / limit),
//                 },
//             },
//             'Taxes retrieved successfully'
//         );
//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateTax = async (req, res, next) => {
//     const transaction = await Taxes.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;
//         const { name, rate, is_active } = req.body;

//         const tax = await Taxes.findOne({
//             where: { tax_id: id, outlet_id: outlet_id },
//         });

//         if (!tax) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Tax is not found', 404);
//         }

//         await tax.update(
//             {
//                 name,
//                 rate,
//                 is_active,
//             },
//             {
//                 transaction,
//             }
//         );

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'update_tax',
//             'taxes',
//             id,
//             `Updated tax : ${name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, tax, 'Tax updated successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.deleteTax = async (req, res, next) => {
//     const transaction = await Taxes.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;

//         const tax = await Taxes.findOne({
//             where: { tax_id: id, outlet_id: outlet_id },
//         });

//         if (!tax) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Tax not found', 404);
//         }

//         await tax.destroy({ transaction });
//         await activityLogService.logActivity(
//             req.user.user_id,
//             'delete_tax',
//             'taxes',
//             id,
//             `Deleted tax : ${tax.name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, null, 'Tax deleted successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };
