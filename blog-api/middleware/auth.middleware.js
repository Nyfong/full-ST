const createError = require('http-errors');

const userModel = require('../models/user.model');
const jwtService = require('../services/jwt.service');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwtService.verifyAccessToken(token);
    const user = userModel.findById(payload.sub);

    if (!user) {
      return next(createError(401, 'Invalid token'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(createError(401, 'Invalid token'));
  }
};

