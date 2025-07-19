const express = require('express');
const router = express.Router();
const transactionReportController = require('../../controllers/report/transaction-report.controller');
const { check } = require('express-validator');
const authMiddleware = require('../../middleware/authMiddleware');

// generate transaction report
router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_reports'),
    [check('start_date').isISO8601().toDate(), check('end_date').isISO8601().toDate()],
    transactionReportController.generateTransactionReport
);

// download transaction report
router.get(
    '/download',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_reports'),
    transactionReportController.downloadReport
);

module.exports = router;
