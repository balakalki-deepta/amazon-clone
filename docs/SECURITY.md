# Security & Guardrails

Plain-English summary of the protections in this project and why each exists.
Scope matches the assignment: no login (a default user is assumed), so this
focuses on API hardening and input safety rather than authentication.

## Backend (Express API)

| Guardrail                        | What it does                                                                                                                                                  | Where                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Helmet**                       | Sets safe HTTP response headers (e.g. `X-Content-Type-Options: nosniff`, `X-Frame-Options`, HSTS) to reduce common browser-side attacks.                      | `src/app.ts`                      |
| **CORS allow-list**              | The API only accepts browser requests from our frontend origin (`CORS_ORIGIN`), not from any random site.                                                     | `src/app.ts`                      |
| **Rate limiting**                | Caps each IP to 200 requests/minute so the API can't be hammered or abused.                                                                                   | `src/middlewares/rateLimit.ts`    |
| **Body size limit**              | Rejects JSON bodies larger than 100 kB (stops memory-abuse payloads).                                                                                         | `src/app.ts`                      |
| **Input validation (zod)**       | Every request body/query is validated and bounded (e.g. `quantity` 1–100, search ≤ 100 chars) before any logic runs. Invalid input → `400`.                   | `*.schema.ts`                     |
| **Server-authoritative pricing** | Order prices come from the database, never from the client — a user cannot set their own prices.                                                              | `order.service.ts`                |
| **Atomic orders + stock checks** | Orders are created in a single transaction; stock is validated and decremented together, and duplicate product lines are merged so stock can't be over-spent. | `order.service.ts`                |
| **No SQL injection**             | All database access goes through Prisma, which parameterises queries.                                                                                         | repositories                      |
| **Safe error responses**         | A central error handler returns a consistent shape and hides internal details/stack traces in production.                                                     | `src/middlewares/errorHandler.ts` |
| **Trust proxy**                  | Correctly reads the real client IP behind the host's proxy so rate limiting works in production.                                                              | `src/app.ts`                      |

## Frontend (React)

| Guardrail                    | What it does                                                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **React auto-escaping**      | React escapes rendered values by default, and we never use `dangerouslySetInnerHTML`, so product/order data can't inject scripts (XSS). |
| **Request timeout**          | API calls time out after 15s instead of hanging forever.                                                                                |
| **URL param sanitation**     | A bad `?page=` value (e.g. `abc` or a negative) safely falls back to page 1.                                                            |
| **No secrets in the bundle** | Only the API base URL is exposed via `VITE_API_URL`; there are no secrets in frontend code.                                             |

## Known, accepted limitations (by assignment design)

- **No authentication.** A single seeded user is assumed logged in, so anyone can
  place orders or view an order by its number. Order numbers are random-ish to
  make guessing impractical. Real auth (login/sessions) is a documented bonus and
  the schema already supports it (`users` table).
