const { v4: uuidv4 } = require('uuid');
const db = require('../db');

function create(userInput) {
  const user = {
    id: uuidv4(),
    name: userInput.name,
    email: userInput.email.toLowerCase(),
    passwordHash: userInput.passwordHash,
    avatar: null,
    role: userInput.role ?? 'user',
    createdAt: new Date().toISOString(),
  };
  db.prepare(
    'INSERT INTO users (id, name, email, passwordHash, avatar, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(user.id, user.name, user.email, user.passwordHash, user.avatar, user.role, user.createdAt);
  return user;
}

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase()) || null;
}

function findById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) || null;
}

function update(id, updates) {
  const user = findById(id);
  if (!user) return null;
  const name = (typeof updates.name === 'string' && updates.name.trim()) ? updates.name.trim() : user.name;
  const avatar = (typeof updates.avatar === 'string') ? updates.avatar : user.avatar;
  db.prepare('UPDATE users SET name = ?, avatar = ? WHERE id = ?').run(name, avatar, id);
  return { ...user, name, avatar };
}

function toSafeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    role: user.role ?? 'user',
    createdAt: user.createdAt,
  };
}

module.exports = { create, findByEmail, findById, update, toSafeUser };
