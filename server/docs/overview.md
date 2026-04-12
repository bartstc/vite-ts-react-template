# Local API Server

A self-contained Fastify server. Runs alongside the Vite dev server and provides a stable, resettable backend for local development and E2E tests.

## Stack

- **Fastify** — HTTP framework with built-in JSON Schema validation
- **lowdb** — JSON file persistence (`src/db/db.json`)
- **@fastify/jwt** — JWT auth (demo only — hardcoded secret, plaintext passwords)

## Modules

| Module     | Base path                 | Auth required |
| ---------- | ------------------------- | ------------- |
| Auth       | `/api/auth`, `/api/users` | writes only   |
| Products   | `/api/products`           | writes only   |
| Marketing  | `/api/marketing/products` | writes only   |
| Test utils | `/api/test`               | none          |

## Commands

```bash
pnpm dev:server        # server only (port 3001)
pnpm dev:all           # server + Vite frontend together
```

## Swagger UI

Start the server and open **http://localhost:3001/docs**.

### Authenticating in Swagger UI

1. `POST /api/auth/login` — use any seeded user:

   ```json
   { "username": "bob", "password": "Pa$$w0rd" }
   ```

   Seeded users: `bob`, `tom`, `jane` — all with password `Pa$$w0rd`.

2. Copy the returned JWT string.

3. Click **Authorize** (top-right lock icon), paste the token — Swagger will attach `Authorization: Bearer <token>` to all subsequent requests automatically.

## Resetting data

```bash
curl -X POST http://localhost:3001/api/test/reset
```

Restores the database to its original seed state. Called automatically before E2E test runs.
