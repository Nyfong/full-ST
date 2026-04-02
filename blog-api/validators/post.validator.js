const { body } = require('express-validator');

const create = [
  body('title').trim().isLength({ min: 3, max: 150 }).withMessage('title must be between 3 and 150 characters'),
  body('content').trim().isLength({ min: 10, max: 50000 }).withMessage('content must be at least 10 characters')
];

const update = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('title must be between 3 and 150 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('content must be at least 10 characters'),
  body().custom(function (value) {
    if (!value || (typeof value.title === 'undefined' && typeof value.content === 'undefined')) {
      throw new Error('provide title or content to update');
    }
    return true;
  })
];

module.exports = {
  create,
  update
};

