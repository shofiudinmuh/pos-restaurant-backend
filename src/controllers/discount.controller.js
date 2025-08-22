const DiscountService = require('../services/discount.service');
const DiscountDto = require('../dtos/discountDto');
const ActivityLogService = require('../services/activity-log.service');
const ApiResponse = require('../utils/responseHandler');

class DiscountController {
    constructor() {
        this.discountService = new DiscountService();
        this.activityLogService = new ActivityLogService();
        this.createDiscount = this.createDiscount.bind(this);
        this.getDiscountById = this.getDiscountById.bind(this);
        this.getDiscounts = this.getDiscounts.bind(this);
        this.updateDiscount = this.updateDiscount.bind(this);
        this.deleteDiscount = this.deleteDiscount.bind(this);
    }

    async createDiscount(req, res, next) {
        try {
            const discountData = DiscountDto.createDiscountDto(req);
            const discount = await this.discountService.createDiscount(discountData);

            await this.activityLogService.logActivity(
                userId,
                'create_discount',
                'discounts',
                discount.discount_id,
                `Created discount ${discount.discount_id}`
            );
            ApiResponse.success(res, discount, 'Discount created successfully');
        } catch (error) {
            next(error);
        }
    }

    async getDiscountById(req, res, next) {
        try {
            const discount = await this.discountService.getDiscountById(req.params.id);
            ApiResponse.success(res, discount, 'Discount created successfully');
        } catch (error) {
            next(error);
        }
    }

    async getDiscounts(req, res, next) {
        try {
            const queryParams = DiscountDto.discountQueryDto(req.params);
            const result = await this.discountService.getDiscounts(queryParams);
            ApiResponse.success(res, result, 'Discount retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    async updateDiscount(req, res, next) {
        try {
            const { updateData, logData } = DiscountDto.updateDiscountDto(req);
            const { discountId, ...fieldsToUpdate } = updateData;
            const updatedDiscount = await this.discountService.updateDiscount(
                discountId,
                fieldsToUpdate
            );

            await this.activityLogService.logActivity(
                logData.userId,
                'update_discount',
                'discounts',
                discountId,
                `Updated discount ${discountId}`
            );

            ApiResponse.success(res, updatedDiscount, 'Discount updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async deleteDiscount(req, res, next) {
        try {
            await this.discountService.deleteDiscount(req.params.id);

            await this.activityLogService.logActivity(
                req.user.user_id,
                'delete_discount',
                'discounts',
                req.params.id,
                `Deleted discount ${req.params.id}`
            );

            ApiResponse.success(res, null, 'Discount deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DiscountController;
// const { Discount } = require('../models');
// const activityLogService = require('../services/activityLogService');
// const ApiResponse = require('../utils/responseHandler');
// const { v4: uuidv4 } = require('uuid');

// exports.createDiscount = async (req, res, next) => {
//     const transaction = await Discount.sequelize.transaction();
//     try {
//         const { outlet_id } = req.user;
//         const { name, type, value, is_member_only, start_date, end_date } = req.body;

//         const discount = await Discount.create(
//             {
//                 discount_id: uuidv4(),
//                 outlet_id,
//                 name,
//                 type,
//                 value,
//                 is_member_only,
//                 start_date,
//                 end_date,
//             },
//             {
//                 transaction,
//             }
//         );

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'create_discount',
//             'discounts',
//             discount.discount_id,
//             `Created discount : ${name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, discount, 'Discount crated successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.getDiscounts = async (req, res, next) => {
//     try {
//         const { outlet_id } = req.user;
//         const { page = 1, limit = 10, sort = 'asc', sortBy = 'created_at' } = req.query;
//         const offset = (page - 1) * limit;

//         const discounts = await Discount.findAndCountAll({
//             where: { outlet_id: outlet_id },
//             order: [[sortBy, sort]],
//             limit,
//             offset,
//         });

//         return ApiResponse.success(
//             res,
//             {
//                 discounts: discounts.rows,
//                 pagination: {
//                     total: discounts.count,
//                     page,
//                     limit,
//                     totalPage: Math.ceil(discounts.count / limit),
//                 },
//             },
//             'Discounts retrieved successfully'
//         );
//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateDiscount = async (req, res, next) => {
//     const transaction = await Discount.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;
//         const { name, type, value, is_member_only, start_date, end_date } = req.body;

//         const discount = await Discount.findOne({
//             where: { discount_id: id, outlet_id: outlet_id },
//         });

//         if (!discount) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Discount not fount', 404);
//         }

//         await discount.update(
//             {
//                 name,
//                 type,
//                 value,
//                 is_member_only,
//                 start_date,
//                 end_date,
//             },
//             { transaction }
//         );
//         await activityLogService.logActivity(
//             req.user.user_id,
//             'update_discount',
//             'discounts',
//             id,
//             `Updated discount : ${name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, discount, 'Discount updated successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.deleteDiscount = async (req, res, next) => {
//     const transaction = await Discount.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;

//         const discount = await Discount.findOne({
//             where: { discount_id: id, outlet_id: outlet_id },
//         });

//         if (!discount) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Discount not found', 404);
//         }

//         await discount.destroy({ transaction });

//         await activityLogService.logActivity(
//             req.user.user_id,
//             'delete_discount',
//             'discounts',
//             id,
//             `Deleted discount : ${discount.name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, null, 'Discount deleted successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };
