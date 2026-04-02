const createError = require('http-errors');
const userModel = require('../models/user.model');

function adminMiddleware(req, res, next) {
  const user = userModel.findById(req.user.id);
  if (!user || user.role !== 'admin') {
    return next(createError(403, 'Admin access required'));
  }
  next();
}

module.exports = adminMiddleware;
