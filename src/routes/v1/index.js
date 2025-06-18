const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoute'));
router.use('/outlets', require('./outletRoute'));

module.exports = router;
