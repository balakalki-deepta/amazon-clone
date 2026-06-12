# Build Roadmap (incremental modules)

We build **one small module at a time**. Each module is reviewed and understood
before we start the next, and each gets its own commit(s). Order is chosen so
every step can be run and verified on its own.

Legend: ⬜ not started · 🟨 doing · ✅ done

---

## Phase 0 — Foundation  ✅ (this step)
- ✅ Architecture decided (React+Vite / Express+TS / Postgres+Prisma)
- ✅ Folder structure & conventions documented
- ✅ Repo skeleton + docker-compose for Postgres + git initialized

## Phase 1 — Backend foundation  ⬜
- Express + TypeScript app boots
- Central config (env), error-handling middleware, response envelope
- `GET /api/health` returns OK
- Prisma connected to the Dockerized Postgres

## Phase 2 — Database schema  ⬜
Design and migrate the schema (evaluated criterion). Tables:
- `users` (single default user)
- `categories`
- `products`
- `product_images` (multiple images per product → carousel)
- `carts`, `cart_items`
- `orders`, `order_items`
- `addresses` (shipping address on checkout)

## Phase 3 — Seed data  ⬜
- Seed categories + products across multiple categories with images & specs
- Seed the default user

## Phase 4 — Products API  ⬜
- `GET /api/products` (list, with `?search=` and `?category=` filters)
- `GET /api/categories`
- `GET /api/products/:id` (detail incl. images & specs)

## Phase 5 — Frontend foundation  ⬜
- Vite + React Router app boots
- API client (axios), shared types
- Amazon-style layout shell: top nav/header, search bar, footer

## Phase 6 — Product Listing Page  ⬜  (Core Feature 1)
- Responsive product grid + product card (image, name, price, Add to Cart)
- Search by name (wired to API)
- Filter by category

## Phase 7 — Product Detail Page  ⬜  (Core Feature 2)
- Image carousel (multiple images)
- Description + specifications
- Price + stock availability status
- Add to Cart + Buy Now

## Phase 8 — Cart API + Cart state  ⬜
- `GET/POST/PATCH/DELETE /api/cart` endpoints
- Frontend CartContext

## Phase 9 — Shopping Cart Page  ⬜  (Core Feature 3)
- List items, update quantity, remove item
- Cart summary: subtotal + total

## Phase 10 — Order API  ⬜
- `POST /api/orders` (create from cart + shipping address)
- `GET /api/orders/:id`

## Phase 11 — Checkout & Confirmation  ⬜  (Core Feature 4)
- Checkout page: shipping address form
- Order summary review → place order
- Order confirmation page showing the order ID

## Phase 12 — Polish & ship  ⬜
- Responsive pass (mobile/tablet/desktop)
- README finalised (setup, stack, assumptions)
- Deploy frontend + backend + DB

## Bonus (if time allows)  ⬜
- Auth (login/signup), order history, wishlist, email on order placement.
