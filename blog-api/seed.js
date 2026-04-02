// Run: node seed.js
// Seeds 6 users + 30 posts into the running blog-api (http://localhost:5001)

const BASE = "http://localhost:5001/api/v1";

const users = [
  { name: "Admin",        email: "admin@blog.com",  password: "admin1234",  role: "admin" },
  { name: "Alice Chen",   email: "alice@dev.com",   password: "password123" },
  { name: "Bob Nguyen",   email: "bob@dev.com",     password: "password123" },
  { name: "Carol Smith",  email: "carol@dev.com",   password: "password123" },
  { name: "David Park",   email: "david@dev.com",   password: "password123" },
  { name: "Eva Martinez", email: "eva@dev.com",     password: "password123" },
  { name: "Frank Lee",    email: "frank@dev.com",   password: "password123" },
];

const posts = [
  // ── Alice ──────────────────────────────────────────────────────────────────
  {
    author: "alice@dev.com",
    title: "Getting Started with Next.js App Router",
    content: `[image]: https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=900&auto=format&fit=crop&q=75

## What is the App Router?

The Next.js App Router introduced in Next.js 13 uses React Server Components by default. It replaces the \`pages/\` directory with an \`app/\` directory, enabling nested layouts, streaming, and server-first data fetching.

## File-based Routing

Every folder inside \`app/\` maps to a URL segment. A \`page.tsx\` file makes the route publicly accessible.

\`\`\`tsx
app/
  page.tsx          → /
  blog/
    page.tsx        → /blog
    [id]/
      page.tsx      → /blog/:id
\`\`\`

## Server Components vs Client Components

\`\`\`tsx
// Server Component — no "use client", runs on server
export default async function Page() {
  const data = await fetch("https://api.example.com/posts").then(r => r.json());
  return <PostList posts={data} />;
}

// Client Component — add "use client" at top
"use client";
import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

> Use Server Components for data fetching and Client Components only when you need interactivity or browser APIs.

## Layouts

\`\`\`tsx
// app/layout.tsx — wraps every page
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
\`\`\``,
  },
  {
    author: "alice@dev.com",
    title: "Mastering TypeScript Utility Types",
    content: `[image]: emoji:🛠️

## Built-in Utility Types

TypeScript ships with powerful utility types that transform existing types without duplication.

## Partial and Required

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// All fields optional
type UserUpdate = Partial<User>;
// { id?: string; name?: string; email?: string; avatar?: string }

// All fields required (reverse of Partial)
type StrictUser = Required<User>;
\`\`\`

## Pick and Omit

\`\`\`typescript
// Keep only selected fields
type UserCard = Pick<User, "id" | "name" | "avatar">;

// Remove selected fields
type PublicUser = Omit<User, "email">;
\`\`\`

## Record

\`\`\`typescript
// Map string keys to a value type
type StatusMap = Record<"active" | "inactive" | "banned", number>;
// { active: number; inactive: number; banned: number }

const counts: StatusMap = { active: 42, inactive: 5, banned: 1 };
\`\`\`

## ReturnType and Parameters

\`\`\`typescript
function createPost(title: string, content: string) {
  return { id: crypto.randomUUID(), title, content };
}

type Post = ReturnType<typeof createPost>;
// { id: string; title: string; content: string }

type PostArgs = Parameters<typeof createPost>;
// [string, string]
\`\`\`

> Utility types let you derive new types from existing ones — write the type once and transform it everywhere.`,
  },
  {
    author: "alice@dev.com",
    title: "React Server Actions Explained",
    content: `[image]: https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=900&auto=format&fit=crop&q=75

## What are Server Actions?

Server Actions allow you to run server-side code directly from form submissions or event handlers in Client Components — no API route needed.

## Basic Form Action

\`\`\`tsx
// app/actions.ts
"use server";
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  await db.insert({ title, content });
}

// app/page.tsx
import { createPost } from "./actions";
export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="content" />
      <button type="submit">Create</button>
    </form>
  );
}
\`\`\`

## With useActionState

\`\`\`tsx
"use client";
import { useActionState } from "react";
import { createPost } from "./actions";

export default function PostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  return (
    <form action={formAction}>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <input name="title" />
      <button disabled={isPending}>{isPending ? "Saving..." : "Save"}</button>
    </form>
  );
}
\`\`\`

> Server Actions eliminate the need for manual API routes for simple mutations — the form just works.`,
  },
  {
    author: "alice@dev.com",
    title: "CSS Grid Layout: A Complete Guide",
    content: `[image]: emoji:🎨

## Grid Basics

CSS Grid is a two-dimensional layout system. Unlike Flexbox, it controls both rows and columns simultaneously.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 1.5rem;
}
\`\`\`

## Named Template Areas

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

## Responsive Without Media Queries

\`\`\`css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
\`\`\`

> \`auto-fill\` creates as many columns as fit. \`minmax(280px, 1fr)\` ensures columns never shrink below 280px.

## Spanning Cells

\`\`\`css
.featured {
  grid-column: span 2;
  grid-row: span 2;
}
\`\`\``,
  },
  {
    author: "alice@dev.com",
    title: "How to Write Clean React Hooks",
    content: `[image]: emoji:⚛️

## Keep Hooks Focused

Each custom hook should do one thing. If your hook is 100 lines, it probably needs to be split.

\`\`\`typescript
// ❌ Too much responsibility
function useEverything() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [theme, setTheme] = useState("light");
  // ...
}

// ✓ Single responsibility
function useUser() { /* ... */ }
function usePosts(userId: string) { /* ... */ }
function useTheme() { /* ... */ }
\`\`\`

## Return a Consistent Shape

\`\`\`typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
\`\`\`

## Avoid State Synchronization

\`\`\`typescript
// ❌ Derived state in useState — will get out of sync
const [fullName, setFullName] = useState(firstName + " " + lastName);

// ✓ Derive it during render
const fullName = \`\${firstName} \${lastName}\`;
\`\`\`

> If a value can be computed from existing state or props, don't put it in state.`,
  },

  // ── Bob ────────────────────────────────────────────────────────────────────
  {
    author: "bob@dev.com",
    title: "Understanding JWT Authentication",
    content: `[image]: https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=900&auto=format&fit=crop&q=75

## What is a JWT?

A JSON Web Token consists of three Base64URL-encoded parts separated by dots: header, payload, and signature.

\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyJ9.SIG
     header              payload        signature
\`\`\`

## The Auth Flow

\`\`\`bash
1. POST /auth/login  { email, password }
2. Server verifies credentials, signs JWT with secret
3. Client stores token in localStorage
4. Every request includes: Authorization: Bearer <token>
5. Server verifies signature — no DB lookup needed
\`\`\`

## Signing a Token (Node.js)

\`\`\`javascript
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
\`\`\`

## Verifying a Token

\`\`\`javascript
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
\`\`\`

> Never store sensitive data in the JWT payload — it's Base64 encoded, not encrypted. Anyone can decode it.`,
  },
  {
    author: "bob@dev.com",
    title: "REST API Design Best Practices",
    content: `[image]: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=75

## Use Nouns, Not Verbs

URLs represent resources. HTTP methods are the verbs.

\`\`\`bash
# ❌ Bad
GET  /getUsers
POST /createPost
GET  /deletePost?id=123

# ✓ Good
GET    /users
POST   /posts
DELETE /posts/123
\`\`\`

## HTTP Status Codes

\`\`\`
200 OK            — Successful GET / PUT
201 Created       — Successful POST
204 No Content    — Successful DELETE
400 Bad Request   — Validation failed
401 Unauthorized  — Missing or invalid token
403 Forbidden     — Token valid, permission denied
404 Not Found     — Resource doesn't exist
409 Conflict      — Duplicate (e.g. email already taken)
\`\`\`

## Consistent Error Shape

\`\`\`json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Must be a valid email" },
    { "field": "password", "message": "Must be at least 8 characters" }
  ]
}
\`\`\`

## Pagination

\`\`\`bash
GET /posts?page=2&limit=20
\`\`\`

\`\`\`json
{
  "posts": [...],
  "total": 147,
  "page": 2,
  "limit": 20,
  "pages": 8
}
\`\`\`

> Version your API from day one: \`/api/v1/\`. When you make breaking changes, bump to \`/api/v2/\`.`,
  },
  {
    author: "bob@dev.com",
    title: "SQL vs NoSQL: Choosing the Right Database",
    content: `[image]: emoji:🗄️

## The Core Difference

SQL databases store data in tables with fixed schemas and relationships. NoSQL databases store data as documents, key-value pairs, or graphs — schema-flexible.

## When to Choose SQL (PostgreSQL, SQLite, MySQL)

\`\`\`sql
-- Strong relationships between entities
SELECT posts.title, users.name
FROM posts
JOIN users ON posts.author_id = users.id
WHERE posts.created_at > '2024-01-01';
\`\`\`

- Data has clear relationships
- You need ACID transactions
- Schema is stable and well-defined
- You need complex queries with aggregations

## When to Choose NoSQL (MongoDB, DynamoDB)

\`\`\`json
{
  "_id": "post-123",
  "title": "My Post",
  "author": { "id": "user-1", "name": "Alice" },
  "tags": ["javascript", "react"],
  "meta": { "views": 1204, "likes": 87 }
}
\`\`\`

- Schema changes frequently
- Data is naturally document-shaped
- You need horizontal scaling at massive scale
- Read patterns are simple (fetch by ID)

## SQLite for Local Development

\`\`\`javascript
const db = new Database("app.db");
db.exec(\`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
)\`);
\`\`\`

> SQLite is a single file — perfect for local dev, prototypes, and apps with moderate traffic (millions of reads/day).`,
  },
  {
    author: "bob@dev.com",
    title: "Node.js Middleware Pattern Explained",
    content: `[image]: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=75

## What is Middleware?

Middleware is a function that sits between the request and response. It can read, modify, or end the request cycle.

\`\`\`javascript
// Signature: (req, res, next) => void
function logger(req, res, next) {
  console.log(\`\${req.method} \${req.path}\`);
  next(); // pass to next middleware
}

app.use(logger);
\`\`\`

## Chaining Middleware

\`\`\`javascript
app.post("/posts",
  authMiddleware,       // 1. verify JWT
  validateMiddleware,   // 2. check body
  postController.create // 3. handle request
);
\`\`\`

## Error Middleware

Error middleware takes 4 arguments. Express identifies it by the extra \`err\` parameter.

\`\`\`javascript
// Must be registered LAST
app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  res.status(status).json({
    error: err.message ?? "Internal server error"
  });
});
\`\`\`

## Auth Middleware Example

\`\`\`javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(createError(401, "No token provided"));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(createError(401, "Invalid token"));
  }
}
\`\`\`

> Think of middleware as a pipeline — each function transforms the request before passing it along.`,
  },
  {
    author: "bob@dev.com",
    title: "Git Branching Strategies for Teams",
    content: `[image]: emoji:🌿

## Why Branching Matters

Branching lets your team work in parallel without stepping on each other. The right strategy depends on team size and release cadence.

## GitHub Flow (Simple & Popular)

\`\`\`bash
# 1. Create a feature branch
git checkout -b feature/user-auth

# 2. Make commits
git add .
git commit -m "Add JWT auth middleware"

# 3. Push and open a PR
git push origin feature/user-auth

# 4. After review, merge to main and deploy
\`\`\`

## Gitflow (Structured Releases)

\`\`\`
main      ─────●─────────────────●──── (production)
               ↑                 ↑
release  ───●──┤       ───●──────┤
             ↑               ↑
develop  ────●──●──●──●──────●─────── (integration)
              ↑     ↑
feature  ─────┘     └───────
\`\`\`

## Commit Message Convention

\`\`\`bash
feat: add user authentication
fix: resolve token expiry bug
refactor: extract auth middleware
docs: update API readme
test: add post creation tests
chore: bump dependencies
\`\`\`

## Useful Commands

\`\`\`bash
git log --oneline --graph --all   # visualize branches
git stash                          # save uncommitted work
git cherry-pick <commit-sha>       # apply a specific commit
git rebase -i HEAD~3               # squash last 3 commits
\`\`\``,
  },

  // ── Carol ──────────────────────────────────────────────────────────────────
  {
    author: "carol@dev.com",
    title: "React useEffect: Common Mistakes and Fixes",
    content: `[image]: emoji:⚛️

## Mistake 1: Missing Dependency Array

\`\`\`typescript
// ❌ Runs on every render
useEffect(() => {
  fetchUser(userId);
});

// ✓ Runs only when userId changes
useEffect(() => {
  fetchUser(userId);
}, [userId]);
\`\`\`

## Mistake 2: Async Effect

\`\`\`typescript
// ❌ useEffect callback cannot be async
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);

// ✓ Define async function inside
useEffect(() => {
  async function load() {
    const data = await fetchData();
    setData(data);
  }
  load();
}, []);
\`\`\`

## Mistake 3: Missing Cleanup

\`\`\`typescript
// ❌ Memory leak — interval never cleared
useEffect(() => {
  setInterval(tick, 1000);
}, []);

// ✓ Return cleanup function
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
\`\`\`

## Mistake 4: Object/Array Dependencies

\`\`\`typescript
// ❌ New object reference every render — infinite loop
useEffect(() => {
  fetchData(options);
}, [{ page: 1 }]);

// ✓ Use primitive values or useMemo
const options = useMemo(() => ({ page: 1 }), []);
useEffect(() => {
  fetchData(options);
}, [options]);
\`\`\``,
  },
  {
    author: "carol@dev.com",
    title: "Building Accessible Web Forms",
    content: `[image]: https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=900&auto=format&fit=crop&q=75

## Why Accessibility Matters

About 15% of the world's population has some form of disability. Accessible forms aren't just good ethics — they improve UX for everyone.

## Label Every Input

\`\`\`html
<!-- ❌ Input with no label -->
<input type="email" placeholder="Email" />

<!-- ✓ Explicit label -->
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email" />

<!-- ✓ Visually hidden but accessible -->
<label class="sr-only" for="search">Search posts</label>
<input id="search" type="search" placeholder="Search..." />
\`\`\`

## Error Messaging

\`\`\`html
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">
  Please enter a valid email address.
</p>
\`\`\`

## Keyboard Navigation

\`\`\`css
/* Never remove focus outlines — restyle them instead */
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
\`\`\`

## ARIA Roles for Dynamic Content

\`\`\`html
<div role="status" aria-live="polite">
  Form submitted successfully!
</div>
\`\`\`

> Accessibility is not a feature — it's a quality standard. Build it in from the start.`,
  },
  {
    author: "carol@dev.com",
    title: "Tailwind CSS v4: What's New",
    content: `[image]: emoji:💨

## CSS-First Configuration

Tailwind v4 moves configuration from \`tailwind.config.js\` into your CSS file:

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #2563eb;
  --font-sans: "Inter", sans-serif;
  --radius-xl: 1rem;
}
\`\`\`

## New Utility Names

Some class names changed to be more consistent:

\`\`\`html
<!-- v3 → v4 -->
bg-gradient-to-r  →  bg-linear-to-r
shadow-sm         →  shadow-xs
ring-offset-2     →  ring-offset-2 (unchanged)
\`\`\`

## Container Queries Built-in

\`\`\`html
<div class="@container">
  <div class="@md:grid-cols-2 grid grid-cols-1">
    ...
  </div>
</div>
\`\`\`

## Dynamic Values Without Arbitrary Syntax

\`\`\`html
<!-- v3: arbitrary values everywhere -->
<div class="h-[420px] w-[320px] mt-[13px]">

<!-- v4: numeric scale extended -->
<div class="h-105 w-80 mt-3.25">
\`\`\`

## Faster Build

v4 uses a new Rust-based engine (Lightning CSS) that is 5-10× faster than v3.

> Tailwind v4 is a ground-up rewrite. If migrating from v3, check the migration guide carefully — many things changed.`,
  },
  {
    author: "carol@dev.com",
    title: "Understanding JavaScript Closures",
    content: `[image]: https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=900&auto=format&fit=crop&q=75

## What is a Closure?

A closure is a function that remembers the variables from its outer scope even after that scope has finished executing.

\`\`\`javascript
function makeCounter() {
  let count = 0; // this variable is "closed over"
  return function increment() {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
\`\`\`

## Practical Use: Factory Functions

\`\`\`javascript
function createMultiplier(factor) {
  return (n) => n * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(5); // 15
\`\`\`

## Common Bug: Loop with var

\`\`\`javascript
// ❌ All buttons alert "3"
for (var i = 0; i < 3; i++) {
  buttons[i].onclick = () => alert(i);
}

// ✓ Fix 1: use let
for (let i = 0; i < 3; i++) {
  buttons[i].onclick = () => alert(i);
}

// ✓ Fix 2: IIFE (old-school)
for (var i = 0; i < 3; i++) {
  buttons[i].onclick = ((j) => () => alert(j))(i);
}
\`\`\`

> Closures are everywhere in JavaScript — callbacks, event handlers, React hooks. Understanding them makes debugging much easier.`,
  },
  {
    author: "carol@dev.com",
    title: "Intro to Docker for Node.js Developers",
    content: `[image]: emoji:🐳

## Why Docker?

Docker packages your app and all its dependencies into a container that runs identically on any machine. No more "works on my machine" bugs.

## Basic Dockerfile

\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## Docker Compose for Local Dev

\`\`\`yaml
# docker-compose.yml
version: "3.9"
services:
  api:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=sqlite:./blog.db
    volumes:
      - .:/app
      - /app/node_modules

  frontend:
    build: ./blogapp
    ports:
      - "3000:3000"
    depends_on:
      - api
\`\`\`

## Useful Commands

\`\`\`bash
docker build -t my-api .          # build image
docker run -p 5001:5001 my-api    # run container
docker compose up --build         # start all services
docker compose down               # stop all services
docker ps                         # list running containers
docker logs my-api                # view logs
\`\`\`

> Use \`.dockerignore\` to exclude \`node_modules\`, \`.env\`, and \`.git\` from the build context.`,
  },

  // ── David ──────────────────────────────────────────────────────────────────
  {
    author: "david@dev.com",
    title: "How the JavaScript Event Loop Works",
    content: `[image]: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=75

## The Single-Threaded Model

JavaScript runs on a single thread — it can only do one thing at a time. Yet it handles async operations without blocking. How?

## The Stack, Queue, and Event Loop

\`\`\`
Call Stack        Web APIs         Callback Queue
──────────        ────────         ──────────────
main()
  ↓
setTimeout(fn,0)  → timer → fn  →  [fn]
  ↓
console.log("A")
  ↓
(stack empty)  ←───── Event Loop picks fn ←─── [fn]
\`\`\`

## Demonstration

\`\`\`javascript
console.log("1");            // synchronous

setTimeout(() => {
  console.log("2");          // macro-task (after stack clears)
}, 0);

Promise.resolve().then(() => {
  console.log("3");          // micro-task (before next macro-task)
});

console.log("4");            // synchronous

// Output: 1, 4, 3, 2
\`\`\`

## Micro-tasks vs Macro-tasks

\`\`\`
Micro-tasks (higher priority):  Promise.then, queueMicrotask
Macro-tasks (lower priority):   setTimeout, setInterval, I/O
\`\`\`

> Micro-tasks are drained completely before the event loop moves to the next macro-task. That's why Promise.then runs before setTimeout even with 0ms delay.`,
  },
  {
    author: "david@dev.com",
    title: "WebSocket vs Server-Sent Events vs Polling",
    content: `[image]: emoji:📡

## The Problem: Real-time Data

HTTP is request-response — the client asks, the server answers. For real-time updates (chat, live scores, dashboards), you need a different approach.

## Polling (Simplest)

\`\`\`javascript
// Client asks every 3 seconds
setInterval(async () => {
  const res = await fetch("/api/messages/latest");
  setMessages(await res.json());
}, 3000);
\`\`\`

- ✓ Works everywhere, simple to implement
- ✗ Wastes bandwidth, latency = poll interval

## Server-Sent Events (One-way Push)

\`\`\`javascript
// Server
res.setHeader("Content-Type", "text/event-stream");
setInterval(() => {
  res.write(\`data: \${JSON.stringify(update)}\\n\\n\`);
}, 1000);

// Client
const es = new EventSource("/api/stream");
es.onmessage = (e) => console.log(JSON.parse(e.data));
\`\`\`

- ✓ Simple, auto-reconnects, HTTP/2 multiplexing
- ✗ One-way only (server → client)

## WebSocket (Full Duplex)

\`\`\`javascript
// Client
const ws = new WebSocket("ws://localhost:5001");
ws.onmessage = (e) => console.log(e.data);
ws.send(JSON.stringify({ type: "chat", text: "hello" }));
\`\`\`

- ✓ Bi-directional, low latency
- ✗ More complex, stateful connections

> Use SSE for dashboards/feeds. Use WebSocket for chat/collaboration. Use polling only as a fallback.`,
  },
  {
    author: "david@dev.com",
    title: "Database Indexing: Why Your Queries Are Slow",
    content: `[image]: https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=900&auto=format&fit=crop&q=75

## What is an Index?

An index is a separate data structure (usually a B-tree) that lets the database find rows without scanning the entire table.

\`\`\`sql
-- Without index: full table scan O(n)
SELECT * FROM posts WHERE author_id = 'abc-123';

-- Create index
CREATE INDEX idx_posts_author ON posts(author_id);

-- Now: index lookup O(log n)
SELECT * FROM posts WHERE author_id = 'abc-123';
\`\`\`

## When to Add an Index

\`\`\`sql
-- Good candidates for indexes:
WHERE clauses:   CREATE INDEX ON posts(created_at);
JOIN columns:    CREATE INDEX ON posts(author_id);
ORDER BY:        CREATE INDEX ON posts(created_at DESC);
Unique fields:   CREATE UNIQUE INDEX ON users(email);
\`\`\`

## The Trade-off

\`\`\`
Reads:  FAST  — index lookup instead of full scan
Writes: SLOWER — every INSERT/UPDATE/DELETE must update the index
Space:  MORE  — index takes additional disk space
\`\`\`

## Composite Indexes

\`\`\`sql
-- Covers queries that filter on both columns
CREATE INDEX idx_posts_author_date ON posts(author_id, created_at DESC);

-- This query uses the composite index efficiently:
SELECT * FROM posts
WHERE author_id = 'abc'
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

> Don't index everything — only columns you filter, sort, or join on frequently. Over-indexing slows writes.`,
  },
  {
    author: "david@dev.com",
    title: "Building a CLI Tool with Node.js",
    content: `[image]: emoji:💻

## Setup

\`\`\`bash
mkdir my-cli && cd my-cli
npm init -y
npm install commander chalk ora
\`\`\`

## Basic CLI Structure

\`\`\`javascript
#!/usr/bin/env node
// bin/cli.js

const { Command } = require("commander");
const chalk = require("chalk");

const program = new Command();

program
  .name("myblog")
  .description("Blog management CLI")
  .version("1.0.0");

program
  .command("seed")
  .description("Seed the database with sample data")
  .option("-c, --count <number>", "Number of posts to create", "10")
  .action(async (options) => {
    const spinner = ora("Seeding database...").start();
    try {
      await seedDatabase(parseInt(options.count));
      spinner.succeed(chalk.green(\`Created \${options.count} posts!\`));
    } catch (e) {
      spinner.fail(chalk.red(e.message));
    }
  });

program.parse();
\`\`\`

## Make it Executable

\`\`\`json
// package.json
{
  "bin": {
    "myblog": "./bin/cli.js"
  }
}
\`\`\`

\`\`\`bash
chmod +x bin/cli.js
npm link   # installs globally for development

myblog seed --count 30
\`\`\`

> CLIs are just Node scripts with argument parsing. \`commander\` handles the parsing; you write the logic.`,
  },
  {
    author: "david@dev.com",
    title: "HTTP Caching Strategies Explained",
    content: `[image]: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=75

## Why Caching Matters

Caching reduces server load, decreases latency, and saves bandwidth. A well-cached app can serve millions of users from a small server.

## Cache-Control Header

\`\`\`bash
# Public cache (CDN + browser), valid for 1 hour
Cache-Control: public, max-age=3600

# Private (browser only), valid for 10 minutes
Cache-Control: private, max-age=600

# Never cache (user-specific data, auth responses)
Cache-Control: no-store

# Must revalidate with server before using stale copy
Cache-Control: no-cache
\`\`\`

## ETag Conditional Requests

\`\`\`javascript
// Server generates ETag from content hash
res.setHeader("ETag", \`"\${hash(content)}"\`);

// Client sends it back next request
// If-None-Match: "abc123"

// Server compares — if unchanged, send 304 Not Modified
if (req.headers["if-none-match"] === currentETag) {
  return res.status(304).end();
}
\`\`\`

## Next.js ISR (Incremental Static Regeneration)

\`\`\`typescript
// Revalidate page every 30 seconds
export const revalidate = 30;

export default async function BlogPage() {
  const posts = await getPosts(); // fetched fresh every 30s
  return <PostGrid posts={posts} />;
}
\`\`\`

> Static + revalidation gives you the speed of static sites with fresh data. It's the best of both worlds.`,
  },

  // ── Eva ────────────────────────────────────────────────────────────────────
  {
    author: "eva@dev.com",
    title: "Designing with Tokens: A Design System Primer",
    content: `[image]: emoji:🎨

## What are Design Tokens?

Design tokens are named variables for design decisions — colors, spacing, typography, shadows. They create a shared language between designers and developers.

## Token Categories

\`\`\`css
:root {
  /* Color tokens */
  --color-primary-500: #2563eb;
  --color-primary-600: #1d4ed8;
  --color-neutral-50:  #f8fafc;
  --color-neutral-900: #0f172a;

  /* Spacing tokens */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-4: 1rem;      /* 16px */
  --space-8: 2rem;      /* 32px */

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-xl: 1.25rem;
  --font-weight-bold: 700;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
}
\`\`\`

## Semantic Tokens

Map primitive tokens to semantic roles:

\`\`\`css
:root {
  --color-background: var(--color-neutral-50);
  --color-text-primary: var(--color-neutral-900);
  --color-interactive: var(--color-primary-500);
}

.dark {
  --color-background: var(--color-neutral-900);
  --color-text-primary: var(--color-neutral-50);
}
\`\`\`

> Semantic tokens are what makes dark mode easy — swap the semantic layer, not every component.`,
  },
  {
    author: "eva@dev.com",
    title: "Micro-interactions: The Details That Make Great UX",
    content: `[image]: https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&auto=format&fit=crop&q=75

## What are Micro-interactions?

Micro-interactions are small, single-purpose animations that communicate system state, guide users, and add delight. They make interfaces feel alive.

## Loading States

\`\`\`tsx
function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button disabled={loading} className="relative">
      <span className={loading ? "opacity-0" : "opacity-100"}>
        Save Changes
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-4 w-4 animate-spin" />
        </span>
      )}
    </button>
  );
}
\`\`\`

## Hover Transitions

\`\`\`css
.card {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}
\`\`\`

## Success Feedback

\`\`\`tsx
function SaveButton() {
  const [saved, setSaved] = useState(false);
  async function handleSave() {
    await save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  return (
    <button onClick={handleSave}>
      {saved ? <><CheckIcon /> Saved!</> : "Save"}
    </button>
  );
}
\`\`\`

> The best micro-interactions are invisible — users don't notice them, but they'd notice if they were gone.`,
  },
  {
    author: "eva@dev.com",
    title: "Dark Mode: Implementation Guide",
    content: `[image]: emoji:🌙

## Strategy 1: CSS Class Toggle

\`\`\`javascript
// Toggle dark class on <html>
function setTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

// Read on page load to avoid flash
const stored = localStorage.getItem("theme");
const preferred = stored ??
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
setTheme(preferred);
\`\`\`

## CSS Variables Approach

\`\`\`css
:root {
  --bg: #ffffff;
  --text: #0f172a;
  --card: #f8fafc;
}

.dark {
  --bg: #0f172a;
  --text: #f8fafc;
  --card: #1e293b;
}

body {
  background: var(--bg);
  color: var(--text);
}
\`\`\`

## Tailwind Dark Mode

\`\`\`html
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  <p class="text-slate-600 dark:text-slate-400">Content</p>
</div>
\`\`\`

## Avoiding Flash of Unstyled Content

\`\`\`html
<!-- In <head> — runs before paint -->
<script>
  const t = localStorage.getItem("theme") ??
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.classList.toggle("dark", t === "dark");
</script>
\`\`\`

> Always read the user's stored preference AND system preference. System preference is the default — user choice overrides it.`,
  },
  {
    author: "eva@dev.com",
    title: "Responsive Typography with CSS Clamp",
    content: `[image]: https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&auto=format&fit=crop&q=75

## The Old Way: Media Queries

\`\`\`css
h1 { font-size: 1.5rem; }

@media (min-width: 768px)  { h1 { font-size: 2rem; } }
@media (min-width: 1200px) { h1 { font-size: 3rem; } }
\`\`\`

This creates jarring jumps at breakpoints.

## The New Way: clamp()

\`\`\`css
/* clamp(minimum, preferred, maximum) */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

/* Fluid paragraph text */
p {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
}
\`\`\`

## The Formula

To scale from 16px at 320px screen to 24px at 1200px screen:

\`\`\`
slope = (24 - 16) / (1200 - 320) = 0.00909
intercept = 16 - 0.00909 × 320 = 13.1px

font-size: clamp(1rem, 0.819rem + 0.909vw, 1.5rem);
\`\`\`

## Fluid Spacing

\`\`\`css
.section {
  padding: clamp(2rem, 5vw, 5rem);
  margin-bottom: clamp(1rem, 3vw, 3rem);
}

.container {
  max-width: 1200px;
  padding-inline: clamp(1rem, 5vw, 3rem);
}
\`\`\`

> With clamp(), your typography smoothly scales across all viewport sizes with a single declaration.`,
  },
  {
    author: "eva@dev.com",
    title: "Framer Motion: Animations in React",
    content: `[image]: emoji:✨

## Installation

\`\`\`bash
npm install framer-motion
\`\`\`

## Basic Animations

\`\`\`tsx
import { motion } from "framer-motion";

// Fade in on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Hello!
</motion.div>
\`\`\`

## Hover and Tap

\`\`\`tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
\`\`\`

## AnimatePresence for Exit Animations

\`\`\`tsx
import { AnimatePresence, motion } from "framer-motion";

<AnimatePresence>
  {isVisible && (
    <motion.div
      key="toast"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
    >
      Saved successfully!
    </motion.div>
  )}
</AnimatePresence>
\`\`\`

## Staggered List

\`\`\`tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

<motion.ul variants={container} initial="hidden" animate="show">
  {posts.map(p => <motion.li key={p.id} variants={item}>{p.title}</motion.li>)}
</motion.ul>
\`\`\``,
  },

  // ── Frank ──────────────────────────────────────────────────────────────────
  {
    author: "frank@dev.com",
    title: "Testing React Components with Vitest",
    content: `[image]: https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=900&auto=format&fit=crop&q=75

## Setup

\`\`\`bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
\`\`\`

\`\`\`typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
});
\`\`\`

## Basic Component Test

\`\`\`tsx
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Counter from "./Counter";

describe("Counter", () => {
  it("increments on click", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    expect(screen.getByText("0")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
\`\`\`

## Mocking Fetch

\`\`\`typescript
import { vi } from "vitest";

beforeEach(() => {
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ posts: [{ id: "1", title: "Test Post" }] }),
  } as Response);
});

afterEach(() => vi.restoreAllMocks());
\`\`\`

> Test behavior, not implementation. Ask "what does the user see and do?" not "what does the function return?".`,
  },
  {
    author: "frank@dev.com",
    title: "Writing Effective Unit Tests",
    content: `[image]: emoji:🧪

## The AAA Pattern

Every test should follow Arrange, Act, Assert:

\`\`\`typescript
describe("createPost", () => {
  it("returns a post with generated id and timestamps", () => {
    // Arrange
    const input = { title: "Hello", content: "World", authorId: "user-1" };

    // Act
    const post = createPost(input);

    // Assert
    expect(post.id).toBeDefined();
    expect(post.title).toBe("Hello");
    expect(post.createdAt).toBeDefined();
  });
});
\`\`\`

## Test Naming Convention

\`\`\`typescript
// Pattern: "it [does something] when [condition]"
it("throws 401 when no token is provided");
it("returns empty array when no posts exist");
it("updates updatedAt timestamp after edit");
\`\`\`

## Testing Edge Cases

\`\`\`typescript
describe("login", () => {
  it("succeeds with correct credentials");
  it("returns 401 with wrong password");
  it("returns 401 with non-existent email");
  it("returns 400 with missing email field");
  it("returns 400 with invalid email format");
  it("is case-insensitive for email");
});
\`\`\`

## What NOT to Test

\`\`\`typescript
// ❌ Testing library internals
expect(component.state.count).toBe(1);

// ❌ Testing implementation details
expect(fetchSpy).toHaveBeenCalledWith("/api/posts");

// ✓ Test what users experience
expect(screen.getByText("Post created!")).toBeInTheDocument();
\`\`\`

> A test suite that only passes when everything is perfect isn't useful. Test the cases that can actually go wrong.`,
  },
  {
    author: "frank@dev.com",
    title: "API Testing with Supertest",
    content: `[image]: https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&auto=format&fit=crop&q=75

## Setup

\`\`\`bash
npm install -D jest supertest
\`\`\`

## Basic Request Tests

\`\`\`javascript
const request = require("supertest");
const app = require("../app");

describe("POST /api/v1/auth/login", () => {
  it("returns 200 and token with valid credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "alice@dev.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("alice@dev.com");
  });

  it("returns 401 with wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "alice@dev.com", password: "wrong" });

    expect(res.status).toBe(401);
  });
});
\`\`\`

## Authenticated Requests

\`\`\`javascript
describe("POST /api/v1/posts", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "alice@dev.com", password: "password123" });
    token = res.body.token;
  });

  it("creates a post with valid token", async () => {
    const res = await request(app)
      .post("/api/v1/posts")
      .set("Authorization", \`Bearer \${token}\`)
      .send({ title: "Test Post", content: "Test content here." });

    expect(res.status).toBe(201);
    expect(res.body.post.title).toBe("Test Post");
  });

  it("returns 401 without token", async () => {
    const res = await request(app)
      .post("/api/v1/posts")
      .send({ title: "Test", content: "Content" });

    expect(res.status).toBe(401);
  });
});
\`\`\``,
  },
  {
    author: "frank@dev.com",
    title: "CI/CD with GitHub Actions",
    content: `[image]: emoji:🚀

## What is CI/CD?

**Continuous Integration** runs tests automatically on every push. **Continuous Deployment** ships passing code to production automatically.

## Basic Node.js CI Pipeline

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm test
      - run: npm run build
\`\`\`

## Environment Secrets

\`\`\`yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: npm run deploy
        env:
          API_KEY: \${{ secrets.API_KEY }}
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
\`\`\`

## Branch Protection Rules

1. Require PR before merging to main
2. Require CI to pass before merge
3. Require at least 1 reviewer approval
4. Dismiss stale reviews on new commits

\`\`\`bash
# Protect main via GitHub CLI
gh api repos/:owner/:repo/branches/main/protection \\
  --method PUT \\
  --field required_status_checks='{"strict":true,"contexts":["test"]}'
\`\`\`

> The goal of CI/CD is to make deploying boring — small, frequent, automatic, and safe.`,
  },
  {
    author: "frank@dev.com",
    title: "Performance Profiling in Node.js",
    content: `[image]: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=75

## Finding Bottlenecks

Before optimizing, measure. Premature optimization is the root of all evil.

## Built-in Profiler

\`\`\`bash
# Run with profiling
node --prof server.js

# After stopping, process the log
node --prof-process isolate-*.log > profile.txt
\`\`\`

## Using clinic.js

\`\`\`bash
npm install -g clinic
clinic doctor -- node server.js
clinic flame  -- node server.js   # flame graph
clinic bubbleprof -- node server.js
\`\`\`

## Measuring with performance.now()

\`\`\`javascript
const { performance } = require("perf_hooks");

async function benchmarkQuery() {
  const start = performance.now();

  const posts = await db.prepare("SELECT * FROM posts").all();

  const duration = performance.now() - start;
  console.log(\`Query took \${duration.toFixed(2)}ms for \${posts.length} rows\`);
}
\`\`\`

## Common Node.js Performance Issues

\`\`\`javascript
// ❌ Blocking the event loop
const hash = crypto.createHash("sha256").update(largeData).digest();

// ✓ Use worker threads for CPU-intensive work
const { Worker } = require("worker_threads");

// ❌ Reading file synchronously in request handler
const config = fs.readFileSync("config.json");

// ✓ Read once at startup, cache the result
let config;
app.once("ready", () => { config = JSON.parse(fs.readFileSync("config.json")); });
\`\`\`

> Profiling reveals surprises. The bottleneck is almost never where you think it is.`,
  },
];

async function register(user) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Register ${user.email} failed: ${body.error ?? res.status}`);
  }
  const data = await res.json();
  // If this account should be admin, promote via the dedicated endpoint
  if (user.role === "admin") {
    await fetch(`${BASE}/auth/promote-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
        "x-seed-secret": "local-seed-only",
      },
    }).catch(() => {});
  }
  return data.token;
}

async function createPost(token, post) {
  const res = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title: post.title, content: post.content }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Post "${post.title}": ${body.error ?? body.details?.map(d => d.message).join(", ") ?? res.status}`);
  }
  return res.json();
}

async function main() {
  console.log(`Seeding blog-api at ${BASE} ...\n`);

  const tokens = {};
  for (const user of users) {
    try {
      tokens[user.email] = await register(user);
      console.log(`✓ Registered  ${user.email}`);
    } catch (e) {
      console.error(`✗ ${e.message}`);
    }
  }

  console.log();

  let created = 0;
  for (const post of posts) {
    const token = tokens[post.author];
    if (!token) { console.error(`✗ No token for ${post.author}`); continue; }
    try {
      await createPost(token, post);
      console.log(`✓ Post  "${post.title}"`);
      created++;
    } catch (e) {
      console.error(`✗ ${e.message}`);
    }
  }

  console.log(`\n✅ Done — ${users.length} users, ${created} posts\n`);
  console.log("Login credentials:");
  users.forEach(u => console.log(`  ${u.email.padEnd(24)} ${u.password}  ${u.role === "admin" ? "[ADMIN]" : ""}`));
}

main().catch(console.error);
