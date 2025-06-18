const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const outletController = require('../../controllers/outletController');
const { validate } = require('../../middleware/validationMiddleware');
const {
    outletValidator,
    paginationValidator,
    idParamValidator,
} = require('../../utils/validators');
const { handleFileUpload } = require('../../middleware/fileUploadMiddleware');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_outlets'),
    handleFileUpload('logo'),
    validate(outletValidator),
    outletController.createOutlet
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_outlets'),
    validate(paginationValidator),
    outletController.getOutlets
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_outlets'),
    validate(idParamValidator),
    outletController.getOutletById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_outlets'),
    handleFileUpload('logo'),
    validate([...idParamValidator, ...outletValidator]),
    outletController.updateOutlet
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_outlets'),
    validate(idParamValidator),
    outletController.deleteOutlet
);

module.exports = router;
