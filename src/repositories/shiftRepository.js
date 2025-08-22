const { Op } = require('sequelize');
const { Shift } = require('../models');
const ApiError = require('../utils/apiError');

class ShiftRepository {
    async createShift(dto) {
        try {
            const shift = await Shift.create({
                outlet_id: dto.outletId,
                kasir_id: dto.kasirId,
                shift_start: dto.shiftStart,
                initial_cash: dto.initialCash,
            });

            return shift.toJSON();
        } catch (error) {
            throw new ApiError('Failed to create shift', 500);
        }
    }

    async endShift(shiftId, closingCash) {
        try {
            const systemTotalCash = 0;
            const [updated] = await Shift.update(
                {
                    shift_end: new Date(),
                    closing_cash: closingCash,
                    system_total_cash: systemTotalCash,
                },
                {
                    where: {
                        shift_id: shiftId,
                    },
                    returning: true,
                }
            );

            if (!updated) {
                throw new ApiError('Failed to update shift', 500);
            }
            const shift = await Shift.findOne({
                where: { shift_id: shiftId },
            });
            return shift.toJSON();
        } catch (error) {
            throw error instanceof ApiError ? error : new ApiError('Failed to end shift', 500);
        }
    }

    async getShiftById(shiftId) {
        try {
            const shift = await Shift.findOne({
                where: { shift_id: shiftId },
            });

            return shift ? shift.toJSON() : null;
        } catch (error) {
            throw new ApiError('Failed to fetch shift', 500);
        }
    }

    async getShiftByOutlet(outletId, options = {}) {
        try {
            const { page, limit, sortBy, sortOrder, search, searchField, startDate, endDate } =
                options;
            const where = { outlet_id: outletId };
            // handle search
            if (search) {
                if (['kasir_id', 'initial_cash'].includes(searchField)) {
                    where[searchField] = search;
                } else {
                    where[searchField] = { [Op.iLike]: `%${search}%` };
                }
            }

            // handle date range
            if (startDate || endDate) {
                where.shift_start = {};
                if (startDate) where.shift_start[Op.gte] = new Date(startDate);
                if (endDate) where.shift_end[Op.lte] = new Date(endDate);
            }

            const { count, rows } = await Shift.findAndCountAll({
                where,
                order: [[sortBy, sortOrder]],
                limit,
                offset: (page - 1) * limit,
            });

            return {
                shifts: rows.map((shift) => shift.toJSON()),
                total: count,
                ...options, //return all filter for metadata
            };
        } catch (error) {
            throw new ApiError('Failed to fetch shifts', 500);
        }
    }

    async isShiftActive(shiftId) {
        try {
            const activeShift = await Shift.findOne({
                where: { shift_id: shiftId, shift_end: null },
            });

            if (!activeShift) {
                throw new ApiError('Shift not found', 404);
            }

            return activeShift.toJSON();
        } catch (error) {
            throw new ApiError('Failed to check active shift', 500);
        }
    }
}

module.exports = ShiftRepository;
