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

## Phase 1 — Backend foundation  ✅
- ✅ Prisma + TypeScript set up; connected to the Dockerized Postgres
- ✅ Express 5 app boots (`npm run dev`), graceful shutdown
- ✅ Typed env config, central error handler, `{ data }`/`{ error }` envelope
- ✅ `GET /api/health` returns OK

## Phase 2 — Database schema  ✅
Designed and migrated (`init` migration). Tables:
- `users` (single default user)
- `categories`
- `products`
- `product_images` (multiple images per product → carousel)
- `carts`, `cart_items`
- `orders`, `order_items`
- `addresses` (shipping address on checkout)

## Phase 3 — Seed data  ✅
- Seeds from DummyJSON: 24 categories, 194 products, 474 images, 1266 specs
- Seeds the default user (`demo@amazonclone.dev`)
- Idempotent + transactional (`npm run db:seed`)

## Phase 4 — Products API  🟨
- ✅ `GET /api/products` (list, with `?search=`, `?category=`, `?page=`, `?limit=`)
- ✅ `GET /api/categories` (with product counts)
- ⬜ `GET /api/products/:slug` (detail incl. images & specs) — with Phase 7

## Phase 5 — Frontend foundation  ✅
- ✅ Vite + React + React Router app boots (`npm run dev`)
- ✅ Typed axios API client (`VITE_API_URL`)
- ✅ Amazon-style layout shell: header (logo, working search, cart), footer
- ✅ Routes: `/` (listing placeholder) + 404

## Phase 6 — Product Listing Page  ✅  (Core Feature 1)
- ✅ Responsive product grid + card (image, title, rating, price, Add to Cart)
- ✅ Search by name (URL-driven, wired to API)
- ✅ Filter by category (sidebar) + pagination + loading/empty/error states
- ✅ Minimal client-side cart (Add to Cart works; header badge updates)

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
