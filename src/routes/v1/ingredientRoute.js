const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const IngredientController = require('../../controllers/ingredient.controller');
const { validate } = require('../../middleware/validationMiddleware');
const { IngredientValidator, PaginationValidator } = require('../../utils/validator');

const ingredientController = new IngredientController();
router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_ingredients'),
    validate(IngredientValidator.create()),
    ingredientController.createIngredient
);

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_ingredients'),
    validate(PaginationValidator.pagination()),
    ingredientController.getIngredients
);

router.get(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('view_ingredients'),
    validate(IngredientValidator.idParam()),
    ingredientController.getIngredient
);

router.put(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_ingredients'),
    validate([...IngredientValidator.idParam(), ...IngredientValidator.update()]),
    ingredientController.updateIngredient
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.checkPermission('manage_ingredients'),
    validate(IngredientValidator.idParam()),
    ingredientController.deleteIngredient
);

module.exports = router;
