# Smart Leads Dashboard — Backend API

A production-grade REST API built with **Node.js + Express + TypeScript + MongoDB**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js |
| Language | TypeScript (strict) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Validation | express-validator |
| Docker | Multi-stage build |

---

## Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   ├── auth.controller.ts   # Register, Login, Me
│   ├── lead.controller.ts   # Full CRUD + export + stats
│   └── user.controller.ts   # Admin user management
├── middleware/
│   ├── auth.ts              # JWT authenticate + RBAC authorize
│   ├── errorHandler.ts      # Global error handler
│   └── validate.ts          # express-validator handler
├── models/
│   ├── User.ts              # User schema + password hashing
│   └── Lead.ts              # Lead schema + indexes
├── routes/
│   ├── auth.routes.ts
│   ├── lead.routes.ts
│   └── user.routes.ts
├── types/
│   └── index.ts             # All interfaces, enums, types
├── utils/
│   ├── jwt.ts               # Sign / verify tokens
│   └── response.ts          # Centralized response helpers
├── validators/
│   ├── auth.validator.ts
│   └── lead.validator.ts
├── app.ts                   # Express app factory
└── server.ts                # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Local Setup

```bash
# 1. Clone the repo and enter directory
cd smart-leads-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Fill in your values (MONGODB_URI, JWT_SECRET, etc.)

# 4. Start development server
npm run dev
```

Server starts at `http://localhost:5000`.

### Docker Setup

```bash
# Copy and configure environment
cp .env.example .env

# Build and run with Docker Compose (includes MongoDB)
docker-compose up --build

# Stop
docker-compose down
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Environment |
| `PORT` | No | `5000` | Server port |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | JWT signing secret (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiry |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000` | Comma-separated CORS origins |

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

Error responses include an `errors` array for validation failures:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Please provide a valid email." }
  ]
}
```

---

### Authentication

#### `POST /api/auth/register`

Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret123",
  "role": "sales"
}
```

> `role` is optional. Defaults to `"sales"`. Accepted values: `"admin"`, `"sales"`.

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales" }
  }
}
```

---

#### `POST /api/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "Secret123"
}
```

**Response `200`:** Same structure as register.

---

#### `GET /api/auth/me` 🔒

Returns the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

---

### Leads

All lead endpoints require `Authorization: Bearer <token>`.

> **Role-based visibility:**
> - **Admin** — can see, edit, and delete all leads.
> - **Sales** — can only see and manage leads they created.

---

#### `GET /api/leads` 🔒

List leads with filtering, search, sort, and pagination.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 10, max: 100) |
| `status` | string | `New` \| `Contacted` \| `Qualified` \| `Lost` |
| `source` | string | `Website` \| `Instagram` \| `Referral` |
| `search` | string | Search by name or email (case-insensitive) |
| `sort` | string | `latest` (default) \| `oldest` |

All filters combine with AND logic.

**Example:**
```
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Leads retrieved successfully.",
  "data": [...],
  "meta": {
    "total": 23,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### `POST /api/leads` 🔒

Create a new lead.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in premium plan"
}
```

**Response `201`:** Created lead object.

---

#### `GET /api/leads/:id` 🔒

Get a single lead by ID.

---

#### `PATCH /api/leads/:id` 🔒

Update a lead (partial updates supported).

**Body:** Any subset of lead fields.

---

#### `DELETE /api/leads/:id` 🔒

Delete a lead.

---

#### `GET /api/leads/export/csv` 🔒

Export leads as a CSV file. Supports all the same filters as `GET /api/leads`.

**Example:**
```
GET /api/leads/export/csv?status=Qualified&source=Instagram
```

Downloads a `.csv` file.

---

#### `GET /api/leads/stats` 🔒 Admin only

Returns aggregate counts by status and source.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "total": 120,
    "byStatus": [
      { "status": "New", "count": 40 },
      { "status": "Contacted", "count": 35 },
      { "status": "Qualified", "count": 30 },
      { "status": "Lost", "count": 15 }
    ],
    "bySource": [
      { "source": "Website", "count": 60 },
      { "source": "Instagram", "count": 40 },
      { "source": "Referral", "count": 20 }
    ]
  }
}
```

---

### Users (Admin Only)

All user management endpoints require Admin role.

#### `GET /api/users` 🔒 Admin

List all users.

#### `GET /api/users/:id` 🔒 Admin

Get a user by ID.

#### `DELETE /api/users/:id` 🔒 Admin

Delete a user. Cannot delete your own account.

---

### Health Check

#### `GET /health`

```json
{
  "success": true,
  "message": "Smart Leads API is running.",
  "timestamp": "2024-06-10T10:00:00.000Z",
  "environment": "production"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient role) |
| `404` | Not Found |
| `409` | Conflict (e.g. duplicate email) |
| `422` | Validation Error |
| `500` | Internal Server Error |

---

## Scripts

```bash
npm run dev      # Development with hot reload (ts-node-dev)
npm run build    # Compile TypeScript → dist/
npm run start    # Run compiled production build
```
