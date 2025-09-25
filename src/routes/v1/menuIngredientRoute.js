const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const MenuIngredientController = require('../../controllers/menu-ingredient.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { MenuIngredientValidator, PaginationValidator } = require('../../utils/validator');

const menuIngredientController = new MenuIngredientController();

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_ingredients'),
    validate(MenuIngredientValidator.create()),
    menuIngredientController.createMenuIngredient
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_ingredients'),
    validate(PaginationValidator.pagination()),
    menuIngredientController.getMenuIngredients
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_ingredients'),
    validate(MenuIngredientValidator.idParam()),
    menuIngredientController.getMenuIngredientById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_ingredients'),
    validate([...MenuIngredientValidator.idParam(), ...MenuIngredientValidator.update()]),
    menuIngredientController.updateMenuIngredient
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_ingredients'),
    validate(MenuIngredientValidator.idParam()),
    menuIngredientController.deleteMenuIngredient
);

module.exports = router;
