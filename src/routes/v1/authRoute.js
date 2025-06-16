const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { validate } = require('../../middleware/validationMiddleware');
const { registerValidator, loginValidator } = require('../../utils/validators');

router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
