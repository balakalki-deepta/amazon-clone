# Architecture

## 1. High-level overview

This is a **client–server** application split into two independently runnable apps inside one repository (a lightweight monorepo):

```
Browser (React SPA)  ──HTTP/JSON──>  Express REST API  ──SQL──>  PostgreSQL
     frontend/                          backend/                  (Docker)
```

- **frontend/** — A React + Vite Single Page Application. It owns all UI, routing,
  and client state. It never talks to the database directly; it only calls the
  backend's REST API.
- **backend/** — A Node + Express + TypeScript REST API. It owns all business
  logic and is the _only_ thing that talks to the database.
- **PostgreSQL** — Runs in Docker (`docker-compose.yml`). Accessed through the
  Prisma ORM so our queries are type-safe.

Keeping these two as separate apps (instead of Next.js full-stack) makes the
data flow explicit and easy to reason about: a request always travels
`UI → API client → route → controller → service → database` and back.

## 2. Why this stack

| Layer    | Choice               | Reason                                                                      |
| -------- | -------------------- | --------------------------------------------------------------------------- |
| Frontend | React 18 + Vite + TS | True SPA as the assignment asks; fast dev server; same language as backend. |
| Routing  | React Router         | Client-side routing for `/`, `/product/:id`, `/cart`, `/checkout`.          |
| Backend  | Express + TypeScript | Minimal, explicit, easy to read top-to-bottom.                              |
| ORM      | Prisma               | Type-safe DB access; schema is the single source of truth.                  |
| Database | PostgreSQL 16        | Robust relational DB; strong support for our relationships.                 |

## 3. Backend architecture (layered + modular)

The backend is organised by **feature module**, and within each module we keep a
strict **layered separation of concerns**. A request flows downward; data flows
back upward:

```
HTTP request
   │
   ▼
routes        ──  defines URLs + HTTP methods, wires middleware
   │
   ▼
controller    ──  reads/validates the request, shapes the HTTP response
   │              (knows about req/res, knows nothing about SQL)
   ▼
service       ──  business logic / rules (the "what we do")
   │              (knows nothing about req/res)
   ▼
repository    ──  database access via Prisma (the "how we read/write")
   │
   ▼
PostgreSQL
```

Each module is self-contained:

```
backend/src/modules/products/
├── product.routes.ts       # GET /api/products, GET /api/products/:id ...
├── product.controller.ts   # request -> response glue
├── product.service.ts      # business logic
├── product.repository.ts   # Prisma queries
├── product.schema.ts       # request validation (zod)
└── product.types.ts        # module-local TypeScript types
```

**Why layers?** Each file has one job, so it's small and explainable. Business
logic is testable without HTTP, and DB access is swappable without touching
business logic.

## 4. Frontend architecture (feature-based)

```
frontend/src/
├── api/          # axios instance + typed endpoint functions
├── components/   # generic reusable UI (Button, Rating, Spinner...)
├── features/     # feature folders (products, cart, checkout...)
├── pages/        # one component per route
├── layout/       # Header, Footer, nav (the Amazon shell)
├── context/      # global state (e.g. CartContext)
├── hooks/        # reusable hooks
├── types/        # shared TS types
└── styles/       # global styles / theme tokens
```

UI components stay "dumb" (props in, events out). Data fetching and state live in
`features/`, `context/`, and `hooks/`. This keeps components reusable and the data
flow predictable.

## 5. API conventions

- Base path: `/api`
- Resource-oriented, plural nouns: `/api/products`, `/api/cart`, `/api/orders`
- JSON in, JSON out
- Consistent response envelope (defined when we build the backend foundation):
  - success: `{ "data": ... }`
  - error: `{ "error": { "message": ..., "code": ... } }`
- Standard HTTP status codes (200, 201, 400, 404, 500).

## 6. "Default user" assumption

The assignment says no login is required — assume a default user is logged in. We
will seed one user row and treat its id as the current user for cart and orders.
This keeps the schema realistic (carts/orders belong to a user) without building
auth. Auth can be added later as a bonus without reshaping the data model.
