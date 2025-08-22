const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const LoyaltyController = require('../../controllers/loyalty-reward.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { LoyaltyRewardValidator, PaginationValidator } = require('../../utils/validator');
const loyaltyController = new LoyaltyController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_loyalty_rewards'),
    validate(LoyaltyRewardValidator.create()),
    loyaltyController.createLoyaltyReward
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_loyalty_rewards'),
    validate(PaginationValidator.pagination()),
    loyaltyController.getLoyaltyRewards
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_loyalty_rewards'),
    validate([...LoyaltyRewardValidator.idParam(), ...LoyaltyRewardValidator.update()]),
    loyaltyController.updateLoyaltyReward
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_loyalty_rewards'),
    validate(LoyaltyRewardValidator.idParam()),
    loyaltyController.deleteLoyaltyReward
);

module.exports = router;
