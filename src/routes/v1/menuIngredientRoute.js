const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const menuIngredientController = require('../../controllers/menuIngredientController');
const { validate } = require('../../middleware/validationMiddleware');
const {
    paginationValidator,
    idParamValidator,
    menuIngredientValidator,
    updateMenuIngredientValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_ingredients'),
    validate(menuIngredientValidator),
    menuIngredientController.createMenuIngredient
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_ingredients'),
    validate(paginationValidator),
    menuIngredientController.getMenuIngredients
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_menu_ingredients'),
    validate(idParamValidator),
    menuIngredientController.getMenuIngredientById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_ingredients'),
    validate([...idParamValidator, ...updateMenuIngredientValidator]),
    menuIngredientController.updateMenuIngredient
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_menu_ingredients'),
    validate(idParamValidator),
    menuIngredientController.deleteMenuIngredient
);

module.exports = router;
