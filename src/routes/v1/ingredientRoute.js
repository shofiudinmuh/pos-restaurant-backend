const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const ingredientController = require('../../controllers/ingredient.controller');
const { validate } = require('../../middleware/validationMiddleware');
const {
    ingredientValidator,
    paginationValidator,
    idParamValidator,
    updateIngredientValidator,
} = require('../../utils/validators');

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_ingredients'),
    validate(ingredientValidator),
    ingredientController.createIngredient
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_ingredients'),
    validate(paginationValidator),
    ingredientController.getIngredients
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_ingredients'),
    validate(idParamValidator),
    ingredientController.getIngredientById
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_ingredients'),
    validate([...idParamValidator, ...updateIngredientValidator]),
    ingredientController.updateIngredient
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_ingredients'),
    validate(idParamValidator),
    ingredientController.deleteIngredient
);

module.exports = router;
