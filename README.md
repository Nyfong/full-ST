# MetaBlog — Setup & Usage Guide

## Project Structure

```
ST_final_project/
├── blog-api/          ← Express backend (Node.js + SQLite)
├── blogapp/           ← Next.js frontend
├── email.md           ← Login credentials
└── SETUP.md           ← This file
```

---

## Prerequisites

Make sure you have these installed:

```bash
node --version    # v18 or higher
npm --version     # v9 or higher
```

---

## 1. Start the Backend (blog-api)

```bash
cd ST_final_project/blog-api
npm install
PORT=5001 npm run dev
```

You should see:

```
[nodemon] starting `node ./bin/www`
Express server listening on port 5001
```

> The database file `blog.db` is created automatically on first run inside the `blog-api/` folder. Data persists across restarts.

### Seed sample data (first time only)

Open a **second terminal** and run:

```bash
cd ST_final_project/blog-api
node seed.js
```

This creates **7 accounts** and **30 sample posts**.

---

## 2. Start the Frontend (blogapp)

Open a **third terminal**:

```bash
cd ST_final_project/blogapp
npm install
npm run dev
```

Open your browser at **http://localhost:3000**

---

## 3. Login Credentials

| Email | Password | Role |
|---|---|---|
| admin@blog.com | admin1234 | **Admin** |
| alice@dev.com | password123 | User |
| bob@dev.com | password123 | User |
| carol@dev.com | password123 | User |
| david@dev.com | password123 | User |
| eva@dev.com | password123 | User |
| frank@dev.com | password123 | User |

---

## 4. Pages & Features

### Public pages (no login needed)

| URL | Description |
|---|---|
| `http://localhost:3000` | Home — featured hero + post grid |
| `http://localhost:3000/blog/:id` | Single post page |
| `http://localhost:3000/contact` | Contact page |

### Auth pages

| URL | Description |
|---|---|
| `http://localhost:3000/login` | Sign in |
| `http://localhost:3000/register` | Create account |

### Logged-in user features

| URL | Description |
|---|---|
| `http://localhost:3000/create` | Write a new post |
| `http://localhost:3000/profile` | Edit name & avatar |
| Single post page | Delete button appears if you are the author |

### Admin only

| URL | Description |
|---|---|
| `http://localhost:3000/admin` | Dashboard — stats, charts, manage all posts |

> Only `admin@blog.com` can access `/admin`. Any other user visiting that URL is redirected to the home page.

---

## 5. Writing a Post

1. Log in and click **Write** in the navbar
2. Fill in the **title** on the left panel
3. Pick a **cover** — paste a URL, upload an image, or choose an emoji
4. Optionally click a **template** (Code Tutorial / Concept Explainer / Quick Tip) to pre-fill the editor
5. Write content in the **right editor panel**
6. Click **Publish Post**

### Supported formatting

| Syntax | Renders as |
|---|---|
| `## My Heading` | Section heading |
| `> My quote` | Styled blockquote |
| ` ```js ... ``` ` | Syntax-highlighted code block |

Use the **toolbar buttons** above the editor to insert these automatically.

---

## 6. Admin Dashboard

Log in as `admin@blog.com`, then click the grid icon in the navbar.

**Overview tab**
- Total posts, authors, word count, avg read time
- Line chart — posts created over the last 14 days
- Bar chart — posts per author
- Recent posts list

**Posts tab**
- Every post listed with title, date, read time
- Click the external link icon to view the post
- Click the trash icon → confirm to delete any post (admin can delete any post regardless of author)

---

## 7. Reset Everything

To wipe all data and start fresh:

```bash
cd ST_final_project/blog-api
rm -f blog.db blog.db-wal blog.db-shm
PORT=5001 npm run dev   # restart API (recreates DB)
node seed.js            # re-seed users and posts
```

---

## 8. Backend API Reference

Base URL: `http://localhost:5001/api/v1`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/login` | — | Login, returns JWT token |
| GET | `/auth/me` | Bearer token | Get current user |
| PUT | `/auth/me` | Bearer token | Update name / avatar |

### Posts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/posts` | — | List all posts |
| GET | `/posts/:id` | — | Get single post |
| POST | `/posts` | Bearer token | Create post |
| PUT | `/posts/:id` | Bearer token (author only) | Update post |
| DELETE | `/posts/:id` | Bearer token (author only) | Delete own post |
| DELETE | `/posts/admin/:id` | Bearer token (admin only) | Delete any post |

### Example: Login and create a post

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@dev.com","password":"password123"}' \
  | jq -r '.token')

# 2. Create post
curl -X POST http://localhost:5001/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"My Post","content":"Hello world content here."}'
```

---

## 9. Common Issues

### Port 5001 already in use

```bash
lsof -ti :5001 | xargs kill -9
```

### Port 3000 already in use

```bash
lsof -ti :3000 | xargs kill -9
```

### Login says "Invalid credentials" after API restart

The API was restarted before seeding. Run:

```bash
cd ST_final_project/blog-api
node seed.js
```

### Database corrupted (SQLITE_IOERR_SHORT_READ)

```bash
cd ST_final_project/blog-api
rm -f blog.db blog.db-wal blog.db-shm
PORT=5001 npm run dev
```

### Frontend can't reach backend

Check that `.env.local` inside `blogapp/` contains:

```
API_URL=http://localhost:5001
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 10. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | Express.js, Node.js |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Charts | Recharts |
| Fonts | Space Grotesk, Syne, JetBrains Mono |
