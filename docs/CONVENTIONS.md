# Conventions & Standards

These rules apply to the **entire project**. The goal is consistency so that any
file looks like it was written by one person, and every change is easy to review.

## 1. Git commit messages (Conventional Commits)

Format: `type(scope): short summary in present tense`

| Type       | When to use it                                                |
| ---------- | ------------------------------------------------------------- |
| `feat`     | A new feature or capability for the user.                     |
| `fix`      | A bug fix.                                                    |
| `refactor` | Code change that neither fixes a bug nor adds a feature.      |
| `chore`    | Tooling, config, deps, scaffolding (no app behaviour change). |
| `docs`     | Documentation only.                                           |
| `style`    | Formatting only (whitespace, semicolons) — no logic change.   |
| `test`     | Adding or fixing tests.                                       |
| `perf`     | A performance improvement.                                    |

**Scope** is the area touched, e.g. `products`, `cart`, `backend`, `frontend`, `db`.

Examples:

```
chore: initialize project structure and conventions
feat(products): add product listing endpoint
feat(frontend): add product card component
fix(cart): correct subtotal rounding
refactor(products): extract price formatting helper
docs: add database schema diagram
```

Rules:

- One logical change per commit. Small, focused commits we can each understand.
- Summary in imperative mood ("add", not "added"), lower-case, no trailing period.
- Keep the summary under ~72 characters.

## 2. Branching

- `main` — always working/deployable.
- Feature work on branches named `type/scope-short-desc`, e.g.
  `feat/products-listing`, `fix/cart-subtotal`.
- We merge into `main` per completed, understood feature.

## 3. File & folder naming

| Thing                  | Convention       | Example               |
| ---------------------- | ---------------- | --------------------- |
| Folders                | kebab-case       | `product-detail/`     |
| Backend module files   | dot-segmented    | `product.service.ts`  |
| React components       | PascalCase       | `ProductCard.tsx`     |
| Hooks                  | camelCase, `use` | `useCart.ts`          |
| Non-component TS files | camelCase        | `formatPrice.ts`      |
| Types/interfaces       | PascalCase       | `Product`, `CartItem` |
| Constants              | UPPER_SNAKE      | `MAX_QUANTITY`        |

## 4. Code style

- **TypeScript everywhere**, `strict` mode on. No implicit `any`.
- Formatting is owned by **Prettier** — never argue about it manually.
- Linting by **ESLint**. Code must lint-clean before commit.
- Prefer small, pure functions. One responsibility per function/file.
- Name things for what they mean, not how they work. No abbreviations like `pr`, `qty` in public APIs (local short vars are fine).
- No commented-out code committed. No `console.log` left in committed code (use a logger / remove).
- Comments explain **why**, not **what** the code already says.

## 5. Backend rules

- Layer boundaries are strict: controllers never run SQL; services never touch `req`/`res`.
- All request input is validated (zod) at the controller boundary.
- Errors are thrown, then handled by a single central error-handling middleware.
- No business logic in routes — routes only wire URL → middleware → controller.

## 6. Frontend rules

- Components are typed with explicit props interfaces.
- Side effects (fetching) live in hooks/features, not deep inside UI components.
- All API calls go through `src/api/` — components never call `fetch`/`axios` directly.
- Money/prices are formatted through one shared helper.

## 7. Environment & secrets

- Never commit real secrets. Each app has a committed `.env.example` and a
  git-ignored `.env`.
- All config is read from env via one typed config module per app.

## 8. Definition of "done" for a feature

1. Code follows the conventions above.
2. It lints and type-checks cleanly.
3. It is committed with a Conventional Commit message.
4. The author can explain every line.
