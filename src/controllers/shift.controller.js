const ShiftService = require('../services/shift.service');
const ApiResponse = require('../utils/responseHandler');
const { createShiftDto, endShiftDto, shiftQueryDto } = require('../dtos/shiftDto');

class ShiftController {
    constructor() {
        this.shiftService = new ShiftService();
    }

    async createShift(req, res, next) {
        try {
            const dto = createShiftDto(req.dtoData);
            if (req.user.user_id !== dto.kasirId) {
                return ApiResponse.error(
                    res,
                    'Only the assigned cashier can created their shift',
                    403
                );
            }
            const shift = await this.shiftService.createShift(dto);
            return ApiResponse.success(res, shift, 'Shift created successfully');
        } catch (error) {
            next(error);
        }
    }

    async endShift(req, res, next) {
        try {
            const dto = endShiftDto(req.dtoData);
            if (req.user.user_id !== dto.kasirId) {
                return ApiResponse.error(res, 'Only the shift cashier can end the shift', 403);
            }
            const shiftEnd = await this.shiftService.endShift(req.params.shiftId, dto);
            return ApiResponse.success(res, shiftEnd, 'Shift ended successfully');
        } catch (error) {
            next(error);
        }
    }

    async getShiftById(req, res, next) {
        try {
            const shift = await this.shiftService.getShiftById(req.params.shiftId);
            return ApiResponse.success(res, shift, 'Shift retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    async getShiftByOutlet(req, res, next) {
        try {
            const filters = shiftQueryDto(req.query);
            const data = await this.shiftService.getShiftByOutlet(req.params.outletId, filters);
            return ApiResponse.success(
                res,
                {
                    data: data.shifts,
                    meta: {
                        total: data.total,
                        page: pagination.page,
                        limit: pagination.limit,
                        totalPage: Math.ceil(data.total / pagination.limit),
                        sort: `${data.sortBy} ${data.sortOrder}`,
                        search: data.search
                            ? {
                                  field: data.searchField,
                                  keyword: data.search,
                              }
                            : null,
                        dateRange: data.startDate
                            ? {
                                  start: data.startDate.toISOString().split('T')[0],
                                  end: data.endDate.toISOString().split('T')[0],
                              }
                            : null,
                    },
                },
                'Shift retrieved successfully'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ShiftController;
