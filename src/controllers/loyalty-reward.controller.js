const { LoyaltyReward } = require('../models');
const activitiLogService = require('../services/activityLogService');
const ApiResponse = require('../utils/responseHandler');
const { v4: uuidv4 } = require('uuid');

exports.createLoyaltyReward = async (req, res, next) => {
    const transaction = await LoyaltyReward.sequelize.transaction();
    try {
        const { outlet_id } = req.user;
        const { name, description, point_required, reward_type, value, menu_id, is_active } =
            req.body;

        const loyaltyReward = await LoyaltyReward.create(
            {
                reward_id: uuidv4(),
                outlet_id,
                name,
                description,
                point_required,
                reward_type,
                value,
                menu_id,
                is_active,
            },
            {
                transaction,
            }
        );

        await activitiLogService.logActivity(
            req.user.user_id,
            'create_loyalty_reward',
            'loyalty_rewards',
            loyaltyReward.reward_id,
            `Created loyaty reward : ${name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, loyaltyReward, 'Loyalty reward created successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.getLoyaltyRewards = async (req, res, next) => {
    try {
        const { outlet_id } = req.user;
        const { page = 1, limit = 10, sort = 'asc', sortBy = 'name' } = req.query;
        const offset = (page - 1) * limit;

        const loyaltyRewards = await LoyaltyReward.findAndCountAll({
            where: { outlet_id: outlet_id },
            include: ['MenuItem'],
            attributes: [
                'name',
                'description',
                'point_required',
                'reward_type',
                'value',
                'menu_id',
                'is_active',
            ],
            page,
            order: [[sortBy, sort]],
            limit,
            offset,
        });

        return ApiResponse.success(
            res,
            {
                loyaltyRewards: loyaltyRewards.rows,
                pagination: {
                    total: loyaltyRewards.count,
                    page,
                    limit,
                    totalPage: Math.ceil(loyaltyRewards.count / limit),
                },
            },
            'Loyalty reward retrieved successfully'
        );
    } catch (error) {
        next(error);
    }
};

exports.updateLoyaltyReward = async (req, res, next) => {
    const transaction = await LoyaltyReward.sequelize.transaction();
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;
        const { name, description, point_required, reward_type, value, menu_id, is_active } =
            req.body;

        const loyaltyReward = await LoyaltyReward.findOne({
            where: { reward_id: id, outlet_id: outlet_id },
        });

        if (!loyaltyReward) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Loyalty reward not found', 404);
        }

        await loyaltyReward.update(
            {
                name,
                description,
                point_required,
                reward_type,
                value,
                menu_id,
                is_active,
            },
            {
                transaction,
            }
        );

        await activitiLogService.logActivity(
            req.user.user_id,
            'update_loyalty_reward',
            'loyalty_rewards',
            id,
            `Updated loyalty reward : ${name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, loyaltyReward, 'Loyalty reward updated successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

exports.deleteLoyaltyReward = async (req, res, next) => {
    const transaction = await LoyaltyReward.sequelize.transaction();
    try {
        const { id } = req.params;
        const { outlet_id } = req.user;

        const loyaltyReward = await LoyaltyReward.findOne({
            where: { reward_id: id, outlet_id: outlet_id },
        });

        if (!loyaltyReward) {
            await transaction.rollback();
            return ApiResponse.error(res, 'Loyalty reward not found', 404);
        }

        await loyaltyReward.destroy({ transaction });

        await activitiLogService.logActivity(
            req.user.user_id,
            'delete_loyalty_reward',
            'loyalty_rewards',
            id,
            `Deleted loyalty reward : ${loyaltyReward.name}`
        );

        await transaction.commit();
        return ApiResponse.success(res, null, 'Loyaty reward deleted successfully');
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
