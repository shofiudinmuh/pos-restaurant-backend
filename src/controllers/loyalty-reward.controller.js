const LoyaltyRewardService = require('../services/loyalty-reward.service');
const LoyaltyRewardDto = require('../dtos/loyaltyRewardDto');
const ActivityLogService = require('../services/activity-log.service');
const ApiResponse = require('../utils/responseHandler');

class LoyaltyRewardController {
    constructor() {
        this.loyaltyRewardService = new LoyaltyRewardService();
        this.activityLogservice = new ActivityLogService();
        this.createLoyaltyReward = this.createLoyaltyReward.bind(this);
        this.updateLoyaltyReward = this.updateLoyaltyReward.bind(this);
        this.getLoyaltyRewardById = this.getLoyaltyRewardById.bind(this);
        this.getLoyaltyRewards = this.getLoyaltyRewards.bind(this);
        this.deleteLoyaltyReward = this.deleteLoyaltyReward.bind(this);
    }

    async createLoyaltyReward(req, res, next) {
        try {
            const loyaltyData = LoyaltyRewardDto.createLoyaltyRewardDto(req);
            const loyaltyReward = await this.loyaltyRewardService.createLoyaltyReward(loyaltyData);

            await this.activityLogservice.logActivity(
                userId,
                'create_loyalty_reward',
                'loyalty_rewards',
                loyaltyReward.reward_id,
                `Created loyalty reward ${loyaltyReward.reward_id}`
            );

            ApiResponse.success(res, loyaltyReward, 'Loyalty reward created successfully');
        } catch (error) {
            next(error);
        }
    }

    async getLoyaltyRewardById(req, res, next) {
        try {
            const loyaltyReward = await this.loyaltyRewardService.getLoyaltyById(req.params.id);
            ApiResponse.success(res, loyaltyReward, 'Loyalty reward retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    async getLoyaltyRewards(req, res, next) {
        try {
            const queryParams = LoyaltyRewardDto.loyaltyRewardQueryDto(req);
            const result = await this.loyaltyRewardService.getLoyaltyRewards(queryParams);
            ApiResponse.success(res, result, 'Loyalty reward retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    async updateLoyaltyReward(req, res, next) {
        try {
            const updateData = LoyaltyRewardDto.updateLoyaltyRewardDto(req);
            const updatedLoyaltyReward = await this.loyaltyRewardService.updateLoyaltyReward(
                updateData
            );

            await this.activityLogservice.logActivity(
                logData.userId,
                'update_loyalty_reward',
                'loyalty_rewards',
                rewardId,
                `Updated loyalty reward ${rewardId}`
            );
            ApiResponse.success(res, updatedLoyaltyReward, 'Loyalty reward updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async deleteLoyaltyReward(req, res, next) {
        try {
            await this.loyaltyRewardService.deleteLoyaltyReward(req.params.id);

            await this.activityLogservice.logActivity(
                req.user.user_id,
                'delete_loyalty_reward',
                req.params.id,
                `Deleted loyalty reward ${req.params.id}`
            );

            ApiResponse.success(res, null, 'Loyalty reward deleted successfully');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = LoyaltyRewardController;
// const { LoyaltyReward } = require('../models');
// const activitiLogService = require('../services/activityLogService');
// const ApiResponse = require('../utils/responseHandler');
// const { v4: uuidv4 } = require('uuid');

// exports.createLoyaltyReward = async (req, res, next) => {
//     const transaction = await LoyaltyReward.sequelize.transaction();
//     try {
//         const { outlet_id } = req.user;
//         const { name, description, point_required, reward_type, value, menu_id, is_active } =
//             req.body;

//         const loyaltyReward = await LoyaltyReward.create(
//             {
//                 reward_id: uuidv4(),
//                 outlet_id,
//                 name,
//                 description,
//                 point_required,
//                 reward_type,
//                 value,
//                 menu_id,
//                 is_active,
//             },
//             {
//                 transaction,
//             }
//         );

//         await activitiLogService.logActivity(
//             req.user.user_id,
//             'create_loyalty_reward',
//             'loyalty_rewards',
//             loyaltyReward.reward_id,
//             `Created loyaty reward : ${name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, loyaltyReward, 'Loyalty reward created successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.getLoyaltyRewards = async (req, res, next) => {
//     try {
//         const { outlet_id } = req.user;
//         const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
//         const offset = (page - 1) * limit;

//         const loyaltyRewards = await LoyaltyReward.findAndCountAll({
//             where: { outlet_id: outlet_id },
//             include: ['MenuItem'],
//             attributes: [
//                 'name',
//                 'description',
//                 'point_required',
//                 'reward_type',
//                 'value',
//                 'menu_id',
//                 'is_active',
//             ],
//             page,
//             order: [[sortBy, sort]],
//             limit,
//             offset,
//         });

//         return ApiResponse.success(
//             res,
//             {
//                 loyaltyRewards: loyaltyRewards.rows,
//                 pagination: {
//                     total: loyaltyRewards.count,
//                     page,
//                     limit,
//                     totalPage: Math.ceil(loyaltyRewards.count / limit),
//                 },
//             },
//             'Loyalty reward retrieved successfully'
//         );
//     } catch (error) {
//         next(error);
//     }
// };

// exports.updateLoyaltyReward = async (req, res, next) => {
//     const transaction = await LoyaltyReward.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;
//         const { name, description, point_required, reward_type, value, menu_id, is_active } =
//             req.body;

//         const loyaltyReward = await LoyaltyReward.findOne({
//             where: { reward_id: id, outlet_id: outlet_id },
//         });

//         if (!loyaltyReward) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Loyalty reward not found', 404);
//         }

//         await loyaltyReward.update(
//             {
//                 name,
//                 description,
//                 point_required,
//                 reward_type,
//                 value,
//                 menu_id,
//                 is_active,
//             },
//             {
//                 transaction,
//             }
//         );

//         await activitiLogService.logActivity(
//             req.user.user_id,
//             'update_loyalty_reward',
//             'loyalty_rewards',
//             id,
//             `Updated loyalty reward : ${name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, loyaltyReward, 'Loyalty reward updated successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };

// exports.deleteLoyaltyReward = async (req, res, next) => {
//     const transaction = await LoyaltyReward.sequelize.transaction();
//     try {
//         const { id } = req.params;
//         const { outlet_id } = req.user;

//         const loyaltyReward = await LoyaltyReward.findOne({
//             where: { reward_id: id, outlet_id: outlet_id },
//         });

//         if (!loyaltyReward) {
//             await transaction.rollback();
//             return ApiResponse.error(res, 'Loyalty reward not found', 404);
//         }

//         await loyaltyReward.destroy({ transaction });

//         await activitiLogService.logActivity(
//             req.user.user_id,
//             'delete_loyalty_reward',
//             'loyalty_rewards',
//             id,
//             `Deleted loyalty reward : ${loyaltyReward.name}`
//         );

//         await transaction.commit();
//         return ApiResponse.success(res, null, 'Loyaty reward deleted successfully');
//     } catch (error) {
//         await transaction.rollback();
//         next(error);
//     }
// };
