# Amazon Clone — E-Commerce Platform

A functional e-commerce web application that replicates Amazon's design and core
shopping experience: product browsing, search & filtering, product details, cart
management, and order placement.

> Built incrementally, one small module at a time. See
> [docs/ROADMAP.md](docs/ROADMAP.md) for progress.

## Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | React 18 + Vite + TypeScript + React Router |
| Backend  | Node.js + Express + TypeScript              |
| Database | PostgreSQL 16 (via Docker) + Prisma ORM     |

## Repository layout

```
.
├── frontend/        # React + Vite SPA
├── backend/         # Express REST API
├── docs/            # Architecture, conventions, roadmap
└── docker-compose.yml   # Local PostgreSQL
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the system is structured and why.
- [docs/DATABASE.md](docs/DATABASE.md) — schema design and reasoning.
- [docs/CONVENTIONS.md](docs/CONVENTIONS.md) — coding standards, commit & naming rules.
- [docs/SECURITY.md](docs/SECURITY.md) — security guardrails (plain English).
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — deploy to Render (free), step by step.
- [docs/ROADMAP.md](docs/ROADMAP.md) — the incremental build plan.

## Deployment

Deployed on [Render](https://render.com) via the `render.yaml` blueprint (backend
Web Service + PostgreSQL + frontend Static Site). See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for click-by-click instructions.

## Getting started

> Setup steps are filled in as each part is built.

### 1. Start the database (Docker)

```bash
docker compose up -d          # starts PostgreSQL 16 on localhost:5432
```

### 2. Set up the backend database

```bash
cd backend
cp .env.example .env          # DATABASE_URL for the Docker Postgres
npm install                   # install dependencies
npx prisma migrate dev        # create tables (runs the init migration)
npm run db:seed               # load catalog from DummyJSON (idempotent)
```

After seeding you'll have 24 categories and 194 products with images & specs.
Inspect the data visually with `npx prisma studio`.

### 3. Run the API server

```bash
cd backend
npm run dev                   # → http://localhost:4000  (GET /api/health)
```

### 4. Run the frontend

```bash
cd frontend
cp .env.example .env          # VITE_API_URL → the backend
npm install
npm run dev                   # → http://localhost:5173
```

## Assumptions

- **No authentication required.** A single default user is seeded and treated as
  the logged-in user for cart and orders (per the assignment).

## License

This project is an educational assignment. Original work.
