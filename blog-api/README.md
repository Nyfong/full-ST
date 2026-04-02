# Blog REST API (MVC + JWT Auth)

This project adds a versioned Blog REST API to the Express app using an MVC structure.

## Features

- JWT authentication (`register`, `login`, `me`)
- Blog post CRUD with ownership checks
- Input validation with `express-validator`
- In-memory models (easy to replace with DB later)
- API tests with Jest + Supertest

## API Base URL

`/api/v1`

## Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token)

### Posts

- `GET /api/v1/posts`
- `GET /api/v1/posts/:id`
- `POST /api/v1/posts` (Bearer token)
- `PUT /api/v1/posts/:id` (Bearer token, owner only)
- `DELETE /api/v1/posts/:id` (Bearer token, owner only)

## Quick Start

```bash
npm install
npm start
```

## Run Tests

```bash
npm test
```

## Environment Variables

- `PORT` (default: `3000`)
- `JWT_SECRET` (default: `dev-secret-change-me`)
- `JWT_EXPIRES_IN` (default: `1d`)

