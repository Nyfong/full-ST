const { validationResult } = require('express-validator');

module.exports = function validateMiddleware(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    error: 'Validation failed',
    details: errors.array().map(function (item) {
      return {
        field: item.param,
        message: item.msg
      };
    })
  });
};

