const { Sequelize } = require('sequelize');

class TransactionReportService {
    constructor(sequelize, activityLogService) {
        this.sequelize = sequelize;
        this.activityLogService = activityLogService;
    }

    async getTransactionReportData(outletId, startDate, endDate) {
        const [reportData, outlet] = await Promise.all([
            this._fetchReportData(outletId, startDate, endDate),
            this._getOutletDetail(outletId),
        ]);

        if (!outlet) {
            throw new Error(`Outlet ${outletId} not found`);
        }

        return {
            metadata: {
                outlet,
                reportPeriod: { startDate, endDate },
                generateAt: new Date(),
            },
            ...reportData,
        };
    }

    async _getOutletDetail(outletId) {
        const [outlet] = await Sequelize.query(
            `SELECT name, address, phone, outlet_code, logo_url
            FROM outlets 
            where id = :outletId`,
            {
                replacements: { outletId },
                type: Sequelize.QueryTypes.SELECT,
            }
        );

        if (!outlet) {
            throw new Error('Outlet not found');
        }

        return outlet;
    }

    async _fetchReportData(outletId, startDate, endDate) {
        const query = `
        SELECT 
            transaction_date,
            total_orders,
            total_subtotal,
            total_tax,
            total_discount,
            total_amount,
            total_paid,
            total_change,
            payment_method,
            payment_count
        FROM transaction_report
        WHERE outlet_id = :outletId
        AND transaction_date BETWEEN :startDate AND :endDate`;

        const [transactions, totals] = await Promise.all([
            this.sequelize.query(query, {
                replacements: { outletId, startDate, endDate },
                type: this.sequelize.QueryTypes.SELECT,
            }),
            this._calculateTotals(outletId, startDate, endDate),
        ]);

        return { transactions, ...totals };
    }

    async _calculateTotals(outletId, startDate, endDate) {
        const query = `
        SELECT 
            SUM(total_amount) AS grand_totals,
            SUM(total_tax) AS total_taxes,
            SUM(total_discount) AS total_discounts,
        FROM transaction_report
        WHERE outlet_id = :outletId
        AND transaction_date BETWEEN :startDate AND :endDate`;

        const [result] = await this.sequelize.query(query, {
            replacements: { outletId, startDate, endDate },
            type: this.sequelize.QueryTypes.SELECT,
        });

        return {
            grandTotal: result.grand_totals || 0,
            totalTax: result.total_taxes || 0,
            totalDiscount: result.total_discounts || 0,
        };
    }
}
