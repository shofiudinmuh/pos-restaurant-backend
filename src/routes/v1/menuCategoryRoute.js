const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const menuCategoryController = require('../../controllers/menu-category.controller');
const { validate } = require('../../middleware/validationMiddleware');
const {
    menuCategoryValidator,
    paginationValidator,
    idParamValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_categories'),
    validate(menuCategoryValidator),
    menuCategoryController.createMenuCategory
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_categories'),
    validate(paginationValidator),
    menuCategoryController.getMenuCategories
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_categories'),
    validate(idParamValidator),
    menuCategoryController.getMenuCategoriesById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_categories'),
    validate([...idParamValidator, ...menuCategoryValidator]),
    menuCategoryController.updateMenuCategory
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_categories'),
    validate(idParamValidator),
    menuCategoryController.deleteMenuCategory
);

module.exports = router;
