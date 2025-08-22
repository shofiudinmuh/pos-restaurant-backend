const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const OutletController = require('../../controllers/outlet.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { OutletValidator, PaginationValidator } = require('../../utils/validator');
const { handleFileUpload } = require('../../middleware/fileUploadMiddleware');
const outletController = new OutletController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_outlets'),
    handleFileUpload('logo'),
    validate(OutletValidator.create()),
    outletController.createOutlet
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_outlets'),
    validate(PaginationValidator.pagination()),
    outletController.getOutlets
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_outlets'),
    validate(OutletValidator.idParam()),
    outletController.getOutletById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_outlets'),
    handleFileUpload('logo'),
    validate([...OutletValidator.idParam(), ...OutletValidator.update()]),
    outletController.updateOutlet
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_outlets'),
    validate(OutletValidator.idParam()),
    outletController.deleteOutlet
);

module.exports = router;
