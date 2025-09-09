const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const MenuCategoryController = require('../../controllers/menu-category.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { MenuCategoryValidator, PaginationValidator } = require('../../utils/validator');

const menuCategoryController = new MenuCategoryController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_categories'),
    validate(MenuCategoryValidator.create()),
    menuCategoryController.createMenuCategory
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_categories'),
    validate(PaginationValidator.pagination()),
    menuCategoryController.getMenuCategories
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_categories'),
    validate(MenuCategoryValidator.idParam()),
    menuCategoryController.getMenuCategoryById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_categories'),
    validate([...MenuCategoryValidator.idParam(), ...MenuCategoryValidator.update()]),
    menuCategoryController.updateMenuCategory
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_categories'),
    validate(MenuCategoryValidator.idParam()),
    menuCategoryController.deleteMenuCategory
);

module.exports = router;
