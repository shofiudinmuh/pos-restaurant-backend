const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const menuController = require('../../controllers/menuItemController');
const { validate } = require('../../middleware/validationMiddleware');
const {
    menuItemValidator,
    paginationValidator,
    idParamValidator,
} = require('../../utils/validators');
const { handleFileUpload } = require('../../middleware/fileUploadMiddleware');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_items'),
    handleFileUpload('photo'),
    validate(menuItemValidator),
    menuController.createMenuItem
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_items'),
    validate(paginationValidator),
    menuController.getMenuItems
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_items'),
    validate(idParamValidator),
    menuController.getMenuItemById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_items'),
    handleFileUpload('photo'),
    validate([...idParamValidator, ...menuItemValidator]),
    menuController.updateMenuItem
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_items'),
    validate(idParamValidator),
    menuController.deleteMenuItem
);

module.exports = router;
