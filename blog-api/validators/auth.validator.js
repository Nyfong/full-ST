const { body } = require('express-validator');

const register = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('name must be between 2 and 80 characters'),
  body('email').isEmail().withMessage('email must be valid').normalizeEmail(),
  body('password').isLength({ min: 6, max: 64 }).withMessage('password must be between 6 and 64 characters')
];

const login = [
  body('email').isEmail().withMessage('email must be valid').normalizeEmail(),
  body('password').notEmpty().withMessage('password is required')
];

module.exports = {
  register,
  login
};

