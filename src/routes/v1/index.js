const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoute'));
router.use('/outlets', require('./outletRoute'));
router.use('/menu-categories', require('./menuCategoryRoute'));
router.use('/menu-items', require('./menuRoute'));
router.use('/ingredients', require('./ingredientRoute'));
router.use('/menu-ingredients', require('./menuIngredientRoute'));
router.use('/inventories', require('./inventoryTransactionRoute'));
router.use('/table-categories', require('./tableCategoryRoute'));
router.use('/tables', require('./tableRoute'));
router.use('/taxes', require('./taxesRoute'));
router.use('/discounts', require('./discountRoute'));
router.use('/loyalty-rewards', require('./loyaltyRewardRoute'));

module.exports = router;
