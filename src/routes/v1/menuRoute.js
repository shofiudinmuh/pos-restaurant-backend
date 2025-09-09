const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const MenuController = require('../../controllers/menu-item.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { handleFileUpload } = require('../../middleware/fileUploadMiddleware');
const { MenuItemValidator, PaginationValidator } = require('../../utils/validator');

const menuItemController = new MenuController();
router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_items'),
    handleFileUpload('photo'),
    validate(MenuItemValidator.create()),
    menuItemController.createMenuItem
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_items'),
    validate(PaginationValidator.pagination()),
    menuItemController.getMenuItems
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_items'),
    validate(MenuItemValidator.idParam()),
    menuItemController.getMenuItemById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_items'),
    handleFileUpload('photo'),
    validate([...MenuItemValidator.idParam(), ...MenuItemValidator.update()]),
    menuItemController.updateMenuItem
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_items'),
    validate(MenuItemValidator.idParam()),
    menuItemController.deleteMenuItem
);

module.exports = router;
