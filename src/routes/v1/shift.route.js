const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const ShiftController = require('../../controllers/shift.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { ShiftValidator, PaginationValidator } = require('../../utils/validator');
const shiftController = new ShiftController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_shifts'),
    validate(ShiftValidator.create()),
    shiftController.createShift
);

router.post(
    '/:shiftId/end',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_shifts'),
    validate([...ShiftValidator.idParam(), ...ShiftValidator.endShift()]),
    shiftController.endShift
);

router.get(
    '/:shiftId',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_shifts'),
    validate(ShiftValidator.idParam()),
    shiftController.getShiftById
);

router.get(
    '/:outletId/shifts',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_shifts'),
    validate(ShiftValidator.idParamOutletId()),
    shiftController.getShiftByOutlet
);

module.exports = router;
