const express = require('express');

const authController = require('../../controller/auth.controller');
const authValidator = require('../../validators/auth.validator');
const authMiddleware = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validate.middleware');

const router = express.Router();

router.post('/register', authValidator.register, validate, authController.register);
router.post('/login', authValidator.login, validate, authController.login);
router.get('/me', authMiddleware, authController.me);
router.put('/me', authMiddleware, authController.updateMe);
router.post('/promote-admin', authMiddleware, authController.promoteAdmin);

module.exports = router;

