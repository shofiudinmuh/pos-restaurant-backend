const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoute'));
router.use('/customers', require('./customerRoute'));
router.use('/discounts', require('./discountRoute'));
router.use('/orders', require('./order.route'));
router.use('/expenses', require('./expense.route'));
router.use('/ingredients', require('./ingredientRoute'));
router.use('/inventories', require('./inventoryTransactionRoute'));
router.use('/loyalty-rewards', require('./loyaltyRewardRoute'));
router.use('/menu-categories', require('./menuCategoryRoute'));
router.use('/menu-items', require('./menuRoute'));
router.use('/menu-ingredients', require('./menuIngredientRoute'));
router.use('/outlets', require('./outlet.route'));
router.use('/table-categories', require('./tableCategoryRoute'));
router.use('/tables', require('./tableRoute'));
router.use('/taxes', require('./taxesRoute'));
router.use('/payments', require('./payment.route'));
// report
router.use('/report/transactions', require('./report.route'));
router.use('/shifts', require('./shift.route'));

module.exports = router;
