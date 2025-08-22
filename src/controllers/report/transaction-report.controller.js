const PDFReportGenerator = require('../../utils/pdfTransactionGenerator');
const TransactionReportService = require('../../services/transaction-report.services');
const ApiResponse = require('../../utils/responseHandler');
const ActivityLogService = require('../../services/activityLogService');
const { validationResult } = require('express-validator');

// inititialize services
const pdfGenerator = new PDFReportGenerator();
const reportService = new TransactionReportService();
const activityLogService = new ActivityLogService();

class ReportController {
    /**Generate transaction report
     * @route GET /api/reports/transactions
     * @param {Date} start_date - Start Date (YYYY-MM-DD)
     * @param {Date} end_data - End Date (YYYY-MM-DD)
     * @returns {Object} Report file and metadata
     */

    async generateTransactionReport(req, res, next) {
        try {
            // validate request
            const validation = validationResult(req);
            if (!validation) {
                return ApiResponse.error(res, 'Validation failed', 404, validation.array());
            }

            const { outlet_id, user_id } = req.user;
            const { start_date, end_date } = req.query;

            // get report data
            const reportData = await reportService.generateTransactionReport(outlet_id, {
                startDate: start_date,
                endDate: end_date,
            });

            // generate pdf report
            const pdfBuffer = await pdfGenerator.generateTransactionReport(reportData);
            result = {
                file: pdfBuffer.toString('base64'),
                filename: `transaction_report_${reportData.metadata.outlet.outlet_code}_${start_date}_to_${end_date}.pdf`,
                type: 'application/pdf',
            };

            // log activity
            await activityLogService.logActivity(
                user_id,
                'generate_report',
                'orders',
                outlet_id,
                `Generated report ${format().toUpperCase()} report from ${start_date} to ${end_date}`
            );

            return ApiResponse.success(res, {
                ...result,
                metadata: {
                    outlet: reportData.metadata.outlet,
                    period: `${start_date} to ${end_date}`,
                    generated_at: new Date().toISOString(),
                    transaction_count: reportData.transaction.length,
                    grand_total: reportData.grandTotal,
                    total_tax: reportData.totalTax,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Download report file
     * @route GET /api/reports/transactions/download
     */

    async downloadReport(req, res, next) {
        try {
            const { file, filename, type = 'application/pdf' } = req.query;

            const buffer = Buffer.from(file, 'base64');

            res.setHeader('Content-Type', type);
            res.setHeader('Content-Disposition', `attachment: filename="${filename}"`);
            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();
