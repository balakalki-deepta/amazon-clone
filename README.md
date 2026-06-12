# Amazon Clone — E-Commerce Platform

A functional e-commerce web application that replicates Amazon's design and core
shopping experience: product browsing, search & filtering, product details, cart
management, and order placement.

> Built incrementally, one small module at a time. See
> [docs/ROADMAP.md](docs/ROADMAP.md) for progress.

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18 + Vite + TypeScript + React Router |
| Backend  | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 (via Docker) + Prisma ORM |

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
- [docs/CONVENTIONS.md](docs/CONVENTIONS.md) — coding standards, commit & naming rules.
- [docs/ROADMAP.md](docs/ROADMAP.md) — the incremental build plan.

## Getting started

> Setup steps are filled in as each part is built. For now:

```bash
# 1. Start the database
docker compose up -d
```

Backend and frontend run instructions will be added in their respective phases.

## Assumptions

- **No authentication required.** A single default user is seeded and treated as
  the logged-in user for cart and orders (per the assignment).

## License

This project is an educational assignment. Original work.
