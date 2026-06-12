# Deployment (Render — free)

We deploy everything on **Render** using the `render.yaml` blueprint at the repo
root. One account, one connected repo, three free pieces:

- **PostgreSQL** (managed database)
- **amazon-clone-api** — the Express backend (Web Service)
- **amazon-clone-web** — the React frontend (Static Site)

> Free-tier notes (fine for a personal project / submission):
>
> - The free **API** sleeps after ~15 min idle; the first request then takes
>   ~50s to wake. Refresh and it's fast again.
> - The free **database is deleted after ~30 days**. To keep it longer, create a
>   free database on [Neon](https://neon.tech) and paste its connection string
>   into the API's `DATABASE_URL` instead (everything else stays the same).

---

## Step 0 — Prerequisites

1. Push this repo to GitHub (it must be public or connected to Render).
2. Create a free account at [render.com](https://render.com) and connect GitHub.

## Step 1 — Create everything from the blueprint

1. Render Dashboard → **New +** → **Blueprint**.
2. Pick this repository. Render detects `render.yaml` and shows the database +
   two services. Click **Apply**.
3. Wait for the first build. The API build also runs `prisma migrate deploy`, so
   your tables are created automatically. (The frontend may show the wrong API
   URL for now — we fix that in Step 3.)

## Step 2 — Seed the catalog (one time)

The database starts empty. To load the 194 products:

1. Open the **amazon-clone-api** service → **Shell** tab.
2. Run:
   ```bash
   npm run db:seed
   ```
   This pulls the catalog from DummyJSON and fills the database. (Only needed
   once; re-running it re-loads the same data.)

## Step 3 — Connect the two URLs

The frontend needs to know the API URL, and the API needs to allow the frontend
origin. After the first deploy, both services have public URLs like
`https://amazon-clone-api.onrender.com` and `https://amazon-clone-web.onrender.com`.

1. **API → CORS_ORIGIN:** open **amazon-clone-api** → **Environment** → set
   `CORS_ORIGIN` to the frontend URL **with no trailing slash**, e.g.
   `https://amazon-clone-web.onrender.com`. Save.
2. **Frontend → VITE_API_URL:** open **amazon-clone-web** → **Environment** → set
   `VITE_API_URL` to the API URL **plus `/api`**, e.g.
   `https://amazon-clone-api.onrender.com/api`. Save.
3. Trigger a redeploy of **both** services (Render usually does this on save;
   if not, use **Manual Deploy → Deploy latest commit**). The frontend must
   rebuild because `VITE_API_URL` is baked in at build time.

## Step 4 — Verify

- Visit the frontend URL → you should see the product grid.
- Search, filter, open a product, add to cart, and place an order.
- The confirmation page should show a real order ID fetched from the live API.

---

## Troubleshooting

| Symptom                                                                       | Fix                                                                                                                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Frontend loads but shows no products / network errors                         | `VITE_API_URL` is wrong or missing `/api`; fix it and redeploy the frontend.                                                                     |
| Browser console shows a CORS error                                            | `CORS_ORIGIN` on the API doesn't exactly match the frontend URL (check `https://`, no trailing slash); fix and redeploy the API.                 |
| First request is very slow                                                    | The free API woke from sleep — normal; subsequent requests are fast.                                                                             |
| Products are empty                                                            | Re-run the seed (Step 2).                                                                                                                        |
| `DATABASE_URL` / SSL errors                                                   | If using an external Postgres (e.g. Neon), append `?sslmode=require` to the connection string.                                                   |
| Build fails: `Cannot find name 'process'` / no declaration file for `express` | `NODE_ENV=production` makes `npm install` skip devDeps (TypeScript, `@types/*`); the build command uses `npm install --include=dev` to fix this. |
