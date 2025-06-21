const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoute'));
router.use('/outlets', require('./outletRoute'));
router.use('/menu-categories', require('./menuCategoryRoute'));
router.use('/menu-items', require('./menuRoute'));

module.exports = router;
