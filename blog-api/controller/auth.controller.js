const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const userModel = require('../models/user.model');
const jwtService = require('../services/jwt.service');

async function register(req, res, next) {
  try {
    const existingUser = userModel.findByEmail(req.body.email);
    if (existingUser) {
      return next(createError(409, 'Email already in use'));
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = userModel.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: passwordHash
    });

    const token = jwtService.signAccessToken({ sub: user.id, email: user.email });

    return res.status(201).json({
      user: userModel.toSafeUser(user),
      token: token
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const user = userModel.findByEmail(req.body.email);
    if (!user) {
      return next(createError(401, 'Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isMatch) {
      return next(createError(401, 'Invalid credentials'));
    }

    const token = jwtService.signAccessToken({ sub: user.id, email: user.email });

    return res.json({
      user: userModel.toSafeUser(user),
      token: token
    });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  res.json({ user: userModel.toSafeUser(req.user) });
}

function updateMe(req, res) {
  const updated = userModel.update(req.user.id, {
    name: req.body.name,
    avatar: req.body.avatar,
  });
  res.json({ user: userModel.toSafeUser(updated) });
}

function promoteAdmin(req, res, next) {
  const secret = req.headers['x-seed-secret'];
  const expected = process.env.SEED_SECRET || 'local-seed-only';
  if (secret !== expected) {
    return next(require('http-errors')(403, 'Forbidden'));
  }
  const db = require('../db');
  db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(req.user.id);
  res.json({ message: 'Promoted to admin' });
}

module.exports = {
  register,
  login,
  me,
  updateMe,
  promoteAdmin,
};

