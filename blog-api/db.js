const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'blog.db'));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Migration: add role column if it doesn't exist yet
const cols = db.pragma('table_info(users)');
if (cols.length > 0 && !cols.find(c => c.name === 'role')) {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    avatar      TEXT,
    role        TEXT NOT NULL DEFAULT 'user',
    createdAt   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id        TEXT PRIMARY KEY,
    title     TEXT NOT NULL,
    content   TEXT NOT NULL,
    authorId  TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users(id)
  );
`);

module.exports = db;
