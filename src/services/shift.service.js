const ShiftRepository = require('../repositories/shiftRepository');
const ApiError = require('../utils/apiError');

class ShiftService {
    constructor() {
        this.shiftRepository = new ShiftRepository();
    }

    async createShift(dto) {
        return this.shiftRepository.createShift(dto);
    }

    async endShift(shiftId, dto) {
        const isActive = await this.shiftRepository.isShiftActive(shiftId);
        if (!isActive) {
            throw new ApiError('Shift already exists', 400);
        }
        return this.shiftRepository.endShift(shiftId, dto.closingCash);
    }

    async getShiftById(shiftId) {
        const shift = await this.shiftRepository.getShiftById(shiftId);
        if (!shift) {
            throw new ApiError('Shift not found', 404);
        }
        return shift;
    }

    async getShiftByOutlet(outletId, filters = { limit: 10, offset: 0 }) {
        try {
            return await this.shiftRepository.getShiftByOutlet(outletId, {
                ...filters,
                // convert data to ISO String for repository
                startDate: filters.startDate?.toISOString(),
                endDate: filters.endDate?.toISOString(),
            });
        } catch (error) {
            // add error context
            if (error.message.includes('Invalid')) {
                throw new ApiError(error.message, 400);
            }
            throw error;
        }
    }
}

module.exports = ShiftService;
