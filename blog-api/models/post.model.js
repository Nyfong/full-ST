const { v4: uuidv4 } = require('uuid');
const db = require('../db');

function create(postInput) {
  const now = new Date().toISOString();
  const post = {
    id: uuidv4(),
    title: postInput.title,
    content: postInput.content,
    authorId: postInput.authorId,
    createdAt: now,
    updatedAt: now,
  };
  db.prepare(
    'INSERT INTO posts (id, title, content, authorId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(post.id, post.title, post.content, post.authorId, post.createdAt, post.updatedAt);
  return post;
}

function list() {
  return db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) || null;
}

function update(id, updates) {
  const post = findById(id);
  if (!post) return null;
  const title = (typeof updates.title === 'string') ? updates.title : post.title;
  const content = (typeof updates.content === 'string') ? updates.content : post.content;
  const updatedAt = new Date().toISOString();
  db.prepare('UPDATE posts SET title = ?, content = ?, updatedAt = ? WHERE id = ?').run(title, content, updatedAt, id);
  return { ...post, title, content, updatedAt };
}

function remove(id) {
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { create, list, findById, update, remove };
