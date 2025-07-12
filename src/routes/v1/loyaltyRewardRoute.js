const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const loyaltyController = require('../../controllers/loyalty-reward.controller');
const { validate } = require('../../middleware/validationMiddleware');
const {
    paginationValidator,
    idParamValidator,
    createLoyaltyRewardsValidator,
    updateLoyaltyRewardsValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_loyalty_rewards'),
    validate(createLoyaltyRewardsValidator),
    loyaltyController.createLoyaltyReward
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_loyalty_rewards'),
    validate(paginationValidator),
    loyaltyController.getLoyaltyRewards
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_loyalty_rewards'),
    validate([...idParamValidator, ...updateLoyaltyRewardsValidator]),
    loyaltyController.updateLoyaltyReward
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_loyalty_rewards'),
    validate(idParamValidator),
    loyaltyController.deleteLoyaltyReward
);

module.exports = router;
