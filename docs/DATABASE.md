# Database Design (PostgreSQL)

> Design reasoning only — no Prisma code yet. This document explains *what* tables
> exist, *why* they exist, how they relate, and the tradeoffs behind each choice.
> The Prisma schema in Phase 2 will be a direct translation of this.

---

## 1. Design principles we follow

1. **Normalize to 3NF for catalog data**, then **deliberately denormalize for
   historical records** (orders). A cart shows *live* product data; an order must
   freeze the data as it was at purchase time. This split is the single most
   important real-world idea in the schema.
2. **One concern per table.** Repeating/variable data (images, specs) lives in its
   own child table instead of wide columns or comma-strings.
3. **Constraints in the database, not just the app.** The DB is the last line of
   defence for data integrity (FKs, CHECKs, UNIQUEs, NOT NULLs).
4. **Index for the queries we actually run** (listing filter, name search, order
   history), not speculatively.
5. **Money is never a float.** We use `NUMERIC` to avoid binary rounding errors.
6. **Every table has surrogate `id`, `created_at`, `updated_at`** (`timestamptz`).

---

## 2. The tables (and why each exists)

### `users`
**Why:** Carts, orders, and addresses all belong to someone. The assignment says
"assume a default user is logged in," so we seed exactly one user and use its id.
Modeling it as a real table (instead of hardcoding) means auth can be added later
with zero schema reshaping.

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | BIGINT (PK, identity) | surrogate key |
| email       | CITEXT, UNIQUE, NOT NULL | case-insensitive unique |
| name        | TEXT, NOT NULL | |
| created_at  | TIMESTAMPTZ, default now() | |
| updated_at  | TIMESTAMPTZ, default now() | |

---

### `categories`
**Why:** "Filter products by category" is a core feature, and categories are
shared across many products — so they get their own table (avoids repeating the
category name on every product row, and lets us rename a category in one place).

| Column      | Type            | Notes |
|-------------|-----------------|-------|
| id          | BIGINT (PK)     | |
| name        | TEXT, NOT NULL  | "Beauty" |
| slug        | TEXT, UNIQUE, NOT NULL | URL-safe "beauty"; used in `?category=` filter |
| parent_id   | BIGINT, FK → categories.id, NULLABLE | **self-reference** for sub-categories (extensibility) |
| created_at  | TIMESTAMPTZ     | |

**Relationship:** one category → many products (1:N). Self-referencing
`parent_id` supports a category tree later without a new table.

---

### `products`
**Why:** The heart of the catalog. One row = one sellable product. Fields that are
1:1 with a product live here; anything repeating (images) or variable (specs) is
split into child tables.

| Column              | Type             | Notes |
|---------------------|------------------|-------|
| id                  | BIGINT (PK)      | |
| title               | TEXT, NOT NULL   | product name |
| slug                | TEXT, UNIQUE, NOT NULL | for clean detail URLs |
| description         | TEXT             | |
| brand               | TEXT, NULLABLE   | not every product has a brand in source data |
| sku                 | TEXT, UNIQUE     | stock-keeping unit |
| category_id         | BIGINT, FK → categories.id, NOT NULL | |
| price               | NUMERIC(12,2), NOT NULL, CHECK ≥ 0 | base price |
| discount_percentage | NUMERIC(5,2), default 0, CHECK 0–100 | drives the "deal" price in UI |
| stock               | INTEGER, NOT NULL, default 0, CHECK ≥ 0 | drives "in stock / out of stock" |
| rating              | NUMERIC(3,2), CHECK 0–5 | average rating (denormalized snapshot) |
| thumbnail_url       | TEXT             | card/grid image |
| created_at          | TIMESTAMPTZ      | |
| updated_at          | TIMESTAMPTZ      | |

**Note on `rating`:** it's stored on the product as a cached average. When we add a
real `reviews` table (bonus), this becomes a maintained aggregate. For now it's
seeded directly from the source.

---

### `product_images`
**Why:** The Product Detail Page needs an **image carousel** = multiple images per
product. That's a classic one-to-many, so a child table — never a comma-separated
string (which can't be indexed, ordered, or validated).

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | BIGINT (PK)    | |
| product_id  | BIGINT, FK → products.id, NOT NULL, ON DELETE CASCADE | delete product ⇒ delete its images |
| url         | TEXT, NOT NULL | |
| position    | SMALLINT, NOT NULL, default 0 | carousel order |
| alt_text    | TEXT, NULLABLE | accessibility |

**Relationship:** one product → many images (1:N).

---

### `product_specifications`
**Why:** "Product description and specifications" is required, and specs vary
wildly between products (a laptop's specs ≠ a perfume's). Two valid approaches:

- **(A) key/value child table** (chosen): flexible, queryable, no schema changes
  to add a new spec. Maps cleanly to DummyJSON's `weight`, `dimensions`,
  `warrantyInformation`, `shippingInformation`, `returnPolicy`.
- **(B) a `JSONB` column** on `products`: simpler, but weaker validation and
  harder to query/aggregate per-spec.

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | BIGINT (PK)    | |
| product_id  | BIGINT, FK → products.id, NOT NULL, ON DELETE CASCADE | |
| spec_key    | TEXT, NOT NULL | "Weight", "Warranty" |
| spec_value  | TEXT, NOT NULL | "4 kg", "1 week warranty" |
| position    | SMALLINT, default 0 | display order |

(Tradeoff discussed in §7.)

---

### `addresses`
**Why:** Checkout needs a shipping address. Addresses belong to a user and a user
may have several, so they're their own table (reusable across orders).

| Column       | Type            | Notes |
|--------------|-----------------|-------|
| id           | BIGINT (PK)     | |
| user_id      | BIGINT, FK → users.id, NOT NULL, ON DELETE CASCADE | |
| full_name    | TEXT, NOT NULL  | |
| phone        | TEXT, NOT NULL  | |
| line1        | TEXT, NOT NULL  | |
| line2        | TEXT, NULLABLE  | |
| city         | TEXT, NOT NULL  | |
| state        | TEXT, NOT NULL  | |
| postal_code  | TEXT, NOT NULL  | text, not int (leading zeros, non-numeric codes) |
| country      | TEXT, NOT NULL  | |
| is_default   | BOOLEAN, default false | |
| created_at   | TIMESTAMPTZ     | |

---

### `carts`
**Why:** A cart is a container that survives across requests. One **active** cart
per user (enforced with a partial unique index). Modeling it as a row (not just
client state) lets the cart persist server-side and become an order atomically.

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | BIGINT (PK)    | |
| user_id     | BIGINT, FK → users.id, NOT NULL, ON DELETE CASCADE | |
| status      | cart_status ENUM, default 'ACTIVE' | ACTIVE / CONVERTED / ABANDONED |
| created_at  | TIMESTAMPTZ    | |
| updated_at  | TIMESTAMPTZ    | |

---

### `cart_items`
**Why:** The lines inside a cart. A join table between carts and products **with a
quantity payload**. Cart items reference *live* products (no price snapshot) — the
cart should always reflect the current price.

| Column      | Type           | Notes |
|-------------|----------------|-------|
| id          | BIGINT (PK)    | |
| cart_id     | BIGINT, FK → carts.id, NOT NULL, ON DELETE CASCADE | |
| product_id  | BIGINT, FK → products.id, NOT NULL, ON DELETE CASCADE | |
| quantity    | INTEGER, NOT NULL, CHECK > 0 | |
| created_at  | TIMESTAMPTZ    | |

**Constraint:** `UNIQUE (cart_id, product_id)` — the same product appears at most
once per cart; adding again increments quantity. This prevents duplicate lines.

---

### `orders`
**Why:** A placed order is a **permanent historical record**. It must NOT change if
a product's price/name later changes or a product is deleted. So orders snapshot
their financial totals, and `order_items` snapshot product details.

| Column             | Type            | Notes |
|--------------------|-----------------|-------|
| id                 | BIGINT (PK)     | |
| order_number       | TEXT, UNIQUE, NOT NULL | human-facing id shown on confirmation page |
| user_id            | BIGINT, FK → users.id, NOT NULL, ON DELETE RESTRICT | never silently lose an order's owner |
| status             | order_status ENUM, default 'PENDING' | |
| subtotal           | NUMERIC(12,2), NOT NULL | sum of line totals |
| shipping_fee       | NUMERIC(12,2), NOT NULL, default 0 | |
| tax                | NUMERIC(12,2), NOT NULL, default 0 | |
| total              | NUMERIC(12,2), NOT NULL | subtotal + shipping + tax |
| ship_full_name     | TEXT, NOT NULL  | **snapshotted** shipping address (see §7) |
| ship_phone         | TEXT, NOT NULL  | |
| ship_line1         | TEXT, NOT NULL  | |
| ship_line2         | TEXT, NULLABLE  | |
| ship_city          | TEXT, NOT NULL  | |
| ship_state         | TEXT, NOT NULL  | |
| ship_postal_code   | TEXT, NOT NULL  | |
| ship_country       | TEXT, NOT NULL  | |
| placed_at          | TIMESTAMPTZ, default now() | |
| created_at         | TIMESTAMPTZ     | |
| updated_at         | TIMESTAMPTZ     | |

**Why `order_number` separate from `id`:** the integer PK is internal; we never
expose sequential PKs publicly (leaks volume, enables guessing). `order_number`
(e.g. `ORD-20260612-000123`) is the safe public identifier shown on the
confirmation page.

---

### `order_items`
**Why:** The frozen line items of an order. Each row **snapshots** the product's
title and unit price at purchase time, so historical orders stay correct forever.

| Column         | Type            | Notes |
|----------------|-----------------|-------|
| id             | BIGINT (PK)     | |
| order_id       | BIGINT, FK → orders.id, NOT NULL, ON DELETE CASCADE | |
| product_id     | BIGINT, FK → products.id, NULLABLE, ON DELETE SET NULL | keep the line even if product is later removed |
| product_title  | TEXT, NOT NULL  | **snapshot** |
| unit_price     | NUMERIC(12,2), NOT NULL | **snapshot** of price at purchase |
| quantity       | INTEGER, NOT NULL, CHECK > 0 | |
| line_total     | NUMERIC(12,2), NOT NULL | unit_price × quantity |

---

## 3. Enums

PostgreSQL native enums give controlled, self-documenting status values with DB
enforcement (vs free-text that drifts).

- **`order_status`**: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- **`cart_status`**: `ACTIVE`, `CONVERTED`, `ABANDONED`

(Future: `payment_status` — `PENDING`, `PAID`, `FAILED`, `REFUNDED`.)

---

## 4. Relationships (summary)

```
users 1───N addresses
users 1───N carts        carts 1───N cart_items ───N─1 products
users 1───N orders       orders 1───N order_items ──N─1 products (nullable)
categories 1───N products
products 1───N product_images
products 1───N product_specifications
categories 1───N categories (self, optional sub-categories)
```

- **1:N** everywhere except the join tables.
- `cart_items` and `order_items` are **associative tables carrying extra data**
  (quantity, price snapshot), which is why they're full tables, not implicit M:N.

---

## 5. Indexing strategy

Indexes are chosen from the real query patterns the app issues:

| Index | Table / columns | Serves |
|-------|-----------------|--------|
| PK btree (auto) | every `id` | lookups, joins |
| UNIQUE | `users.email`, `products.slug`, `products.sku`, `categories.slug`, `orders.order_number` | integrity + fast lookup |
| btree | `products.category_id` | category filter on listing page |
| **GIN (pg_trgm)** | `products.title` | `ILIKE '%term%'` name search (fuzzy, fast) |
| btree | `product_images.product_id` | load carousel for a product |
| btree | `product_specifications.product_id` | load specs for a product |
| UNIQUE | `cart_items (cart_id, product_id)` | dedupe + fast item lookup |
| btree | `cart_items.cart_id` | load a cart's items |
| **partial UNIQUE** | `carts (user_id) WHERE status='ACTIVE'` | one active cart per user |
| btree | `orders (user_id, placed_at DESC)` | order history, newest first |
| btree | `order_items.order_id` | load an order's lines |

**Why pg_trgm for search:** the assignment's search is "by name," typically a
substring/contains match. A plain btree can't accelerate `ILIKE '%x%'`; a
`pg_trgm` GIN index can. If search needs to scale to full descriptions later, we'd
move to a `tsvector` full-text index.

---

## 6. Constraints (integrity rules)

- **FKs** on every relationship, with intentional `ON DELETE`:
  - `CASCADE` for owned children (cart_items, product_images, specs).
  - `RESTRICT` on `orders.user_id` (never orphan an order's owner).
  - `SET NULL` on `order_items.product_id` (keep the historical line if the
    product is removed from the catalog).
- **CHECKs:** `price ≥ 0`, `stock ≥ 0`, `quantity > 0`, `rating 0–5`,
  `discount_percentage 0–100`.
- **NOT NULL** on every column required to make a row meaningful.
- **UNIQUE** on natural keys (email, slug, sku, order_number) and the
  `(cart_id, product_id)` pair.

---

## 7. Tradeoffs made

1. **Order snapshotting (denormalization on purpose).** We copy the shipping
   address and product title/price into `orders`/`order_items` instead of relying
   on FKs alone. Cost: duplicated data. Benefit: an order is an immutable receipt —
   editing a product or address never rewrites history. This is the correct
   real-world model and a deliberate, justified break from strict normalization.

2. **Specs as a key/value table vs JSONB.** Key/value gives per-spec querying,
   ordering, and validation, at the cost of more rows/joins. JSONB would be fewer
   joins but weaker integrity. For an evaluated, relational-modeling assignment,
   the explicit table demonstrates normalization better. (JSONB noted as a viable
   alternative if specs were purely display-only.)

3. **`rating` cached on `products`.** Denormalized average for fast listing. Cost:
   must be recomputed when reviews change. Acceptable because listing reads vastly
   outnumber review writes.

4. **`BIGINT` identity PKs + separate public identifiers** (`slug`,
   `order_number`) instead of UUID PKs. BIGINT keys are compact and index-friendly
   (better for join-heavy workloads); UUIDs would help only for distributed
   id-generation we don't need. We avoid exposing sequential ids by using slugs and
   order numbers publicly.

5. **Cart references live prices (no snapshot); orders snapshot.** Matches user
   expectation: the cart total reflects current prices; the order locks them in.

---

## 8. Performance considerations

- **Indexes match query patterns** (§5) — category filter, name search, order
  history are all index-backed.
- **Avoid N+1:** the ORM will use joins/`include` to fetch a product with its
  images/specs in one round trip.
- **Pagination:** product listing uses `LIMIT/OFFSET` for the assignment; keyset
  (cursor) pagination is the scalable upgrade for deep pages.
- **`NUMERIC` for money** trades a little speed for correctness — the right call
  for financial data. (Integer minor-units/"cents" is the alternative used by some
  high-scale systems; noted but unnecessary here.)
- **Connection pooling** (e.g. PgBouncer / Prisma pool) for many concurrent API
  requests on a small DB.
- **`timestamptz`** stores in UTC, avoiding timezone bugs.

---

## 9. Future extensibility (no reshaping required)

| Feature | How the schema already supports it |
|---------|-----------------------------------|
| Auth (bonus) | `users` already exists; add `password_hash`/sessions. |
| Order history (bonus) | `orders (user_id, placed_at)` index already serves it. |
| Sub-categories | `categories.parent_id` self-reference already present. |
| Reviews | add `reviews` table; `products.rating` becomes its aggregate. |
| Wishlist (bonus) | add `wishlists` + `wishlist_items` (mirrors cart pattern). |
| Payments | add `payments` + `payment_status` enum, FK → orders. |
| Product variants (size/color) | add `product_variants`; `cart_items`/`order_items` point to a variant. |
| Multi-warehouse inventory | move `stock` into an `inventory` table keyed by warehouse. |
| Coupons/discounts | add `coupons` + `order_discounts`. |

---

## 10. Why this is production-grade

- **Referential integrity** enforced in the DB, not hoped for in the app.
- **Historical correctness** via order/line snapshots — receipts never mutate.
- **Controlled state** via enums; **valid data** via CHECK constraints.
- **3NF catalog** with deliberate, documented denormalization where it's correct.
- **Indexes derived from real queries**, including proper fuzzy-search support.
- **Extensible** to every bonus feature without rewriting existing tables.

---

## 11. Seed data plan (Phase 3)

**Source:** [DummyJSON Products](https://dummyjson.com/products) — 100 products
across ~24 categories, free, with real CDN image URLs. Verified field mapping:

| DummyJSON field | Goes to |
|-----------------|---------|
| `category` | `categories.name` / `.slug` (deduped into category rows) |
| `title`, `description`, `brand`, `sku`, `price`, `discountPercentage`, `stock`, `rating`, `thumbnail` | `products.*` |
| `images[]` | `product_images` rows (with `position`) |
| `weight`, `dimensions`, `warrantyInformation`, `shippingInformation`, `returnPolicy`, `minimumOrderQuantity` | `product_specifications` key/value rows |
| `reviews`, `tags`, `meta`, `availabilityStatus` | ignored for now (extra data) |

Plus one seeded **default user** (and a sample address). Cart/order tables start
empty and fill through normal app use. The seed script will fetch DummyJSON,
upsert categories, then insert products with their images and specs in a
transaction so the seed is idempotent and atomic.
