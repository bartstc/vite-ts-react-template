# Server Implementation Spec — Local API Server

| Meta    | Value                                                            |
| ------- | ---------------------------------------------------------------- |
| Status  | `approvedś`                                                      |
| Feature | Local Fastify API server replacing Fake Store API                |
| Scope   | `server/` directory (new), root config, `e2e/`, `src/` API layer |

## References

Read those:

- seed-data-marketing.md
- seed-data-product-catalog.md

---

## 1. Goal & Context

The template currently depends on Fake Store API (`fakestoreapi.com`) for its demo app. This external API is unreliable, causing E2E test failures in CI and blocking local development. The goal is to replace it with a self-contained local Fastify server that lives inside the same repository, runs with a single command, and mirrors the data model of the existing C# ECommerce project (two microservices collapsed into one server) so the frontend can later switch to the C# backend with minimal changes.

This also enables building a more advanced demo app (auth, CRUD, ratings) beyond what Fake Store API offered.

## 2. Requirements

- **R1**: WHEN a developer clones the repo and runs `pnpm install` at the root, THE SYSTEM SHALL install both frontend and server dependencies via pnpm workspaces.
- **R2**: WHEN a developer runs `pnpm dev:server`, THE SYSTEM SHALL start a Fastify server on port `3001` serving all API endpoints with seed data loaded.
- **R3**: WHEN a developer runs `pnpm dev:all`, THE SYSTEM SHALL start both the Vite dev server (port 5173) and the Fastify server (port 3001) concurrently.
- **R4**: THE SYSTEM SHALL expose product catalog endpoints: list products with pagination (GET), get product (GET), add product (POST, auth), update product (PUT, auth), update price (PATCH, auth), delete product (DELETE, auth).
- **R5**: THE SYSTEM SHALL expose marketing endpoints: get product rating (GET), create marketing product (POST, auth), rate product (PATCH, auth), archive marketing product (DELETE, auth).
- **R6**: THE SYSTEM SHALL expose auth endpoints: login (POST), get current user (GET, auth).
- **R7**: WHEN a read endpoint (GET) is called without auth, THE SYSTEM SHALL return data normally (no auth required for reads).
- **R8**: WHEN a write endpoint is called without a valid auth token, THE SYSTEM SHALL return 401 Unauthorized.
- **R9**: THE SYSTEM SHALL persist data in a JSON file via lowdb, enabling easy inspection and reset.
- **R10**: THE SYSTEM SHALL ship a committed `db.json` file with seed data. WHEN the server starts, it reads from this file. The seed data files in `seed-data/` serve as the source of truth for generating `db.json` and for the test reset endpoint.
- **R11**: WHEN `POST /api/test/reset` is called, THE SYSTEM SHALL reset the database to its seed state (for E2E test determinism).
- **R12**: THE SYSTEM SHALL work identically inside the devcontainer and outside it.
- **R13**: WHEN Playwright E2E tests run (locally or in CI), THE SYSTEM SHALL be started automatically via Playwright's `webServer` config.

## 3. Non-Goals

- No production deployment support (no Docker, no PM2, no process managers).
- No real password hashing or secure JWT — this is a demo server. Tokens are signed with a hardcoded secret.
- No database migrations or schema versioning — seed script handles initialization.
- No registration endpoint — only login with seeded users. (Can be added later.)
- No WebSocket or real-time features.
- No rate limiting, HTTPS, or production security hardening.
- This spec does NOT cover frontend changes to consume the new API — that will be a separate spec/task.

## 4. Design

### 4.1 Project structure

```
root/
├── server/
│   ├── package.json          # server deps (fastify, lowdb, etc.)
│   ├── tsconfig.json         # Node-targeted TS config
│   └── src/
│       ├── index.ts          # entry point — starts Fastify
│       ├── app.ts            # Fastify app factory (for testing)
│       ├── config.ts         # port, JWT secret, env flags
│       ├── db/
│       │   ├── database.ts   # lowdb setup + initialization
│       │   ├── seed.ts       # seed data loader
│       │   └── db.json       # seed data file (committed to git)
│       ├── plugins/
│       │   ├── cors.ts       # CORS plugin registration
│       │   └── auth.ts       # JWT verification decorator + preHandler hook
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.routes.ts
│       │   │   ├── auth.handlers.ts
│       │   │   ├── auth.schemas.ts
│       │   │   └── auth.types.ts     # User, LoginBody, etc.
│       │   ├── products/
│       │   │   ├── products.routes.ts
│       │   │   ├── products.handlers.ts
│       │   │   ├── products.schemas.ts
│       │   │   └── products.types.ts  # Product, ProductDto, MoneyDto, etc.
│       │   ├── marketing/
│       │   │   ├── marketing.routes.ts
│       │   │   ├── marketing.handlers.ts
│       │   │   ├── marketing.schemas.ts
│       │   │   └── marketing.types.ts # MarketingProduct, RatingDto, etc.
│       │   └── test/
│       │       └── test.routes.ts  # reset endpoint
│       └── shared/
│           └── types.ts          # DatabaseSchema (the db.json shape), shared enums/constants
├── pnpm-workspace.yaml       # NEW — declares workspaces
├── package.json              # existing frontend package.json (modified — add root scripts)
└── ...
```

### 4.2 Tech stack

| Concern      | Package               | Rationale                                    |
| ------------ | --------------------- | -------------------------------------------- |
| Framework    | `fastify`             | Modern, fast, built-in schema validation     |
| CORS         | `@fastify/cors`       | Official Fastify CORS plugin                 |
| TypeScript   | `tsx`                 | Zero-config TS execution for dev             |
| Build        | `tsc`                 | Standard TS compilation (if needed later)    |
| Persistence  | `lowdb`               | JSON file storage, zero infrastructure       |
| Auth tokens  | `@fastify/jwt`        | Official JWT plugin for Fastify              |
| Validation   | Fastify JSON Schema   | Built into Fastify, no extra dependency      |
| UUID         | `crypto.randomUUID()` | Built into Node.js, no extra dependency      |
| Dev runner   | `tsx watch`           | File-watching for development                |
| Concurrently | `concurrently`        | Run frontend + server together (root devDep) |

### 4.3 Design decisions

**Persistence: lowdb over SQLite** — The C# project uses Marten (document store / event sourcing). A JSON document store maps more naturally than SQL tables. lowdb stores everything in a single readable `db.json` file, making it trivial to inspect, reset, and version. Switching to the C# backend later means the Node server is entirely disposable — no migration concerns.

**Single server vs. two servers** — The C# project runs ProductCatalog on port 5000 and Marketing on port 5001. For the template, we collapse both into a single Fastify instance with separate route modules. Internal separation via `modules/products/` and `modules/marketing/` preserves the conceptual boundary. Splitting later requires only extracting modules into separate Fastify instances.

**Auth: simplified JWT** — Login accepts `{ username, password }`, validates against seeded users (plaintext comparison), returns `{ token }` as a plain string (matching existing frontend `httpService.post<string>` expectation). Token contains `{ userId, username, email, displayName }`. The `GET /api/account` endpoint returns the user object from the token. No registration.

### 4.4 Boundaries

- ✅ **Always** — create/modify any file inside `server/`, `pnpm-workspace.yaml`, root `package.json` scripts section
- ⚠️ **Ask first** — modify `playwright.config.ts`, modify `vite.config.ts` or frontend env config, add root-level devDependencies
- 🚫 **Never** — modify existing frontend source code in `src/` (separate task), modify existing test files, delete any existing files

## 5. API Contract

### 5.1 Auth

#### `POST /api/auth/login`

Request:

```json
{ "username": "bob", "password": "Pa$$w0rd" }
```

Response `200`: JWT token as a plain JSON string:

```json
"eyJhbGciOiJIUzI1NiIs..."
```

Response `401`:

```json
{ "message": "Invalid username or password" }
```

#### `GET /api/users/:id`

Returns the user object (mimicking Fake Store API shape for now). No auth required.

Response `200`:

```json
{
  "id": 1,
  "email": "bob@test.com",
  "username": "bob",
  "name": { "firstname": "Bob", "lastname": "Smith" },
  "phone": "1-234-567-8900",
  "address": {
    "city": "Anytown",
    "street": "Main St",
    "number": 123,
    "zipcode": "12345",
    "geolocation": { "lat": "40.7128", "long": "-74.0060" }
  }
}
```

Response `404`:

```json
{ "message": "User not found" }
```

### 5.2 Product Catalog

All responses use this DTO shape:

```json
{
  "id": "4f968992-1aab-49c9-8913-09405915c1c0",
  "name": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  "description": "Your perfect pack for everyday use...",
  "price": { "amount": 109.95, "currency": "USD" },
  "imageUrl": "https://placehold.co/600x400?text=Foldsack+Backpack",
  "category": "clothing",
  "addedAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": null
}
```

#### `GET /api/products`

Returns a paginated collection. No auth.

Query params:

- `limit` (number, default `10`) — max number of products to return
- `sort` (`asc` | `desc`, default `asc`) — sort by `addedAt`

Response `200`:

```json
{
  "products": [
    /* ProductDto[] */
  ],
  "meta": {
    "limit": 10,
    "sort": "asc",
    "total": 20
  }
}
```

#### `GET /api/products/:id`

Returns `ProductDto`. No auth.

Response `404`:

```json
{ "message": "Product not found" }
```

#### `POST /api/products` (auth required)

Request:

```json
{
  "name": "Example Product",
  "description": "This is an example product description.",
  "price": { "amount": 49.99, "code": "USD" },
  "imageUrl": "https://example.com/image.jpg",
  "category": "electronics"
}
```

Response `201`: returns the created `ProductDto`.

Response `400`:

```json
{ "message": "Validation error details" }
```

#### `PUT /api/products/:id` (auth required)

Request (partial — only fields being updated):

```json
{
  "name": "Updated Name",
  "description": "Updated description.",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

Response `200`: returns the updated `ProductDto`.

Response `404`:

```json
{ "message": "Product not found" }
```

#### `PATCH /api/products/:id/price` (auth required)

Request:

```json
{ "amount": 120, "code": "USD" }
```

Response `200`: returns the updated `ProductDto`.

Response `404`:

```json
{ "message": "Product not found" }
```

#### `DELETE /api/products/:id` (auth required)

Response `204`: no body.

Response `404`:

```json
{ "message": "Product not found" }
```

### 5.3 Marketing

Marketing data is keyed by product ID and tracks ratings.

#### `GET /api/marketing/products/:id`

Returns the marketing data for a product. No auth.

Response `200`:

```json
{
  "id": "4f968992-1aab-49c9-8913-09405915c1c0",
  "rating": { "rate": 3.9, "count": 120 },
  "addedAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": null
}
```

Response `404`:

```json
{ "message": "Product not found" }
```

#### `POST /api/marketing/products` (auth required)

Creates a marketing record for a product (called when a product is first created in the catalog so it can start receiving ratings).

Request:

```json
{ "productId": "6e42e7c0-8d86-480b-bdf3-9c332d8a4832" }
```

Response `201`:

```json
{
  "id": "6e42e7c0-8d86-480b-bdf3-9c332d8a4832",
  "rating": { "rate": 0, "count": 0 },
  "addedAt": "2025-06-01T12:00:00.000Z",
  "updatedAt": null
}
```

Response `409`:

```json
{ "message": "Marketing product already exists" }
```

#### `PATCH /api/marketing/products/:id/rate` (auth required)

Request:

```json
{ "rating": 4.5 }
```

Response `200`: returns the updated marketing `ProductDto` (rating recalculated as running average, count incremented).

Response `404`:

```json
{ "message": "Product not found" }
```

#### `DELETE /api/marketing/products/:id` (auth required)

Archives (deletes) the marketing record for a product.

Response `204`: no body.

Response `404`:

```json
{ "message": "Product not found" }
```

### 5.4 Test Utilities

#### `POST /api/test/reset`

Resets the database to seed state. No auth required (only meant for test use).

Response `200`:

```json
{ "message": "Database reset to seed state" }
```

## 6. Task Breakdown

### Phase 1 — Server scaffold [S]

**Traces: R1, R2, R12**

1. Create `pnpm-workspace.yaml` at repo root declaring `"."` and `"server"` as workspaces.
2. Create `server/package.json` with dependencies: `fastify`, `@fastify/cors`, `@fastify/jwt`, `lowdb`. DevDependencies: `tsx`, `typescript`, `@types/node`.
3. Create `server/tsconfig.json` targeting `ES2022`, `NodeNext` module system, `strict: true`, outDir `dist/`, rootDir `src/`.
4. Create `server/src/config.ts` — exports `PORT` (default `3001`), `JWT_SECRET` (hardcoded string), `DB_PATH` (default `server/src/db/db.json`).
5. Create `server/src/app.ts` — Fastify app factory that registers CORS plugin, JWT plugin, and all route modules. Exported for testing.
6. Create `server/src/index.ts` — imports app, calls `listen()` on configured port, seeds DB if needed.
7. Add scripts to `server/package.json`: `"dev": "tsx watch src/index.ts"`, `"start": "tsx src/index.ts"`, `"build": "tsc"`.
8. Add scripts to root `package.json`: `"dev:server": "pnpm --filter server dev"`, `"dev:all": "concurrently \"pnpm dev\" \"pnpm dev:server\""`. Add `concurrently` as a root devDependency.
9. Verify: `pnpm install` from root installs both workspaces. `pnpm dev:server` starts Fastify on port 3001.

### Phase 2 — Persistence layer [S]

**Traces: R9, R10**

1. Create module-scoped type files — `server/src/modules/auth/auth.types.ts` (User, LoginBody), `server/src/modules/products/products.types.ts` (Product, ProductDto, MoneyDto, Category enum), `server/src/modules/marketing/marketing.types.ts` (MarketingProduct, RatingDto).
2. Create `server/src/shared/types.ts` — the `DatabaseSchema` type (shape of `db.json`: `{ users, products, marketingProducts }`), shared constants (category values, currency codes).
3. Create `server/src/db/database.ts` — initializes lowdb with `JSONFilePreset`, exports a `getDb()` function. The database schema has top-level keys: `users`, `products`, `marketingProducts`.
4. Create `server/src/db/seed.ts` — exports a `seedDatabase()` function that checks if the DB is empty and populates it with seed data. Import seed data from separate data files (`seed-data/users.ts`, `seed-data/products.ts`, `seed-data/marketing.ts`).
5. Create `server/src/db/seed-data/users.ts` — seeded user data (see `seed-data-users` reference below or create based on the C# seed users: Bob, Tom, Jane).
6. Create `server/src/db/seed-data/products.ts` — seeded product catalog data (see companion doc: `seed-data-product-catalog.md`).
7. Create `server/src/db/seed-data/marketing.ts` — seeded marketing data (see companion doc: `seed-data-marketing.md`).
8. Generate `server/src/db/db.json` with the seed data and commit it to git. This serves as the initial state and can be reset to at any time.
9. Verify: the server starts and reads from the committed `db.json`. Calling `POST /api/test/reset` restores it to the committed seed state.

**Seed users reference** (3 users matching the C# seed):

| id  | email         | username | displayName | password |
| --- | ------------- | -------- | ----------- | -------- |
| 1   | bob@test.com  | bob      | Bob         | Pa$$w0rd |
| 2   | tom@test.com  | tom      | Tom         | Pa$$w0rd |
| 3   | jane@test.com | jane     | Jane        | Pa$$w0rd |

Each user also has dummy profile fields matching the `UserDto` shape: `name` (firstname/lastname), `phone`, `address` with `geolocation`. These are for compatibility with the existing frontend user model.

### Phase 3 — Auth module [S]

**Traces: R6, R7, R8**

1. Create `server/src/plugins/auth.ts` — registers `@fastify/jwt` with the hardcoded secret. Exports a `authenticate` preHandler hook that verifies the JWT and returns 401 if invalid/missing.
2. Create `server/src/modules/auth/auth.schemas.ts` — JSON Schema for login request body.
3. Create `server/src/modules/auth/auth.handlers.ts` — login handler: find user by username, compare password (plaintext), sign JWT with user payload, return token as plain string.
4. Create `server/src/modules/auth/auth.routes.ts` — registers `POST /api/auth/login` and `GET /api/users/:id` (returns user from DB, no auth).
5. Verify: `POST /api/auth/login` with `{ "username": "bob", "password": "Pa$$w0rd" }` returns a JWT string. Using that token in Authorization header allows access to protected routes. `GET /api/users/1` returns user data without auth.

### Phase 4 — Product Catalog module [S]

**Traces: R4, R7, R8**

1. Create `server/src/modules/products/products.schemas.ts` — JSON Schemas for create, update, and price update request bodies.
2. Create `server/src/modules/products/products.handlers.ts` — handlers for all CRUD operations. Each handler reads/writes via lowdb. Write handlers use the `authenticate` preHandler.
3. Create `server/src/modules/products/products.routes.ts` — registers all product routes under `/api/products`.
4. Verify: all six product endpoints work correctly. GET endpoints work without auth. POST/PUT/PATCH/DELETE return 401 without token.

### Phase 5 — Marketing module [S]

**Traces: R5, R7, R8**

1. Create `server/src/modules/marketing/marketing.types.ts` — types for MarketingProduct, RatingDto (if not already created in Phase 2).
2. Create `server/src/modules/marketing/marketing.schemas.ts` — JSON Schemas for create (productId body), rate (rating body) request bodies.
3. Create `server/src/modules/marketing/marketing.handlers.ts`:
   - **get** — returns marketing data for a product by ID.
   - **create** — creates a new marketing record with `rate: 0, count: 0` for a given `productId`. Returns 409 if already exists.
   - **rate** — recalculates running average: `newRate = ((oldRate * oldCount) + newRating) / (oldCount + 1)`, increments count, sets `updatedAt`.
   - **archive** — removes the marketing record for a product. Returns 404 if not found.
4. Create `server/src/modules/marketing/marketing.routes.ts` — registers routes under `/api/marketing/products`: GET `/:id` (no auth), POST `/` (auth), PATCH `/:id/rate` (auth), DELETE `/:id` (auth).
5. Verify: `GET /api/marketing/products/:id` returns rating data. `POST /api/marketing/products` creates a new record. `PATCH /api/marketing/products/:id/rate` with auth updates the rating. `DELETE /api/marketing/products/:id` removes the record.

### Phase 6 — Test reset endpoint [S]

**Traces: R11**

1. Create `server/src/modules/test/test.routes.ts` — registers `POST /api/test/reset` which re-runs the seed function, overwriting current DB state.
2. Verify: creating a product, then calling reset, then listing products returns only the original seed data.

### Phase 7 — Playwright integration [S]

**Traces: R13**

1. Modify `playwright.config.ts` — add a `webServer` entry for the API server: `command: "pnpm dev:server"`, `port: 3001`, `reuseExistingServer: !process.env.CI`.
2. Optionally add a `globalSetup` or `beforeAll` in Playwright that calls `POST /api/test/reset` to ensure seed state before the test suite runs.
3. Verify: `pnpm test:e2e` starts both servers automatically and tests can reach the API on port 3001.

### Phase 8 — Documentation [P]

**Traces: R1, R2, R3**

1. Update root `README.md`:
   - Add `pnpm dev:server` and `pnpm dev:all` to the commands table.
   - Update the "Demo app" description to mention the local API server instead of Fake Store API.
   - Mention pnpm workspaces in the getting started section.
2. Create `server/README.md` with:
   - Brief overview of the server purpose.
   - Available endpoints table.
   - How to add new endpoints.
   - Seed data description.
3. Add `CLAUDE.md` notes for the server workspace if the project uses one.

## 7. Error & Edge Cases

- **GIVEN** the server starts **WHEN** `db.json` exists and has data **THEN** the server uses the existing data as-is without re-seeding.
- **GIVEN** a `POST /api/products` request **WHEN** the `category` value is not one of `clothing`, `jewelery`, `electronics` **THEN** the server returns 400 with a validation error.
- **GIVEN** a `GET /api/products` request **WHEN** `limit` exceeds the total number of products **THEN** the server returns all products and `meta.total` reflects the actual count.
- **GIVEN** a `GET /api/products/:id` request **WHEN** the ID does not match any product **THEN** the server returns 404 with `{ "message": "Product not found" }`.
- **GIVEN** a `PATCH /api/marketing/products/:id/rate` request **WHEN** the `rating` value is not between 0 and 5 **THEN** the server returns 400 with a validation error.
- **GIVEN** a `POST /api/marketing/products` request **WHEN** a marketing record already exists for that `productId` **THEN** the server returns 409 with `{ "message": "Marketing product already exists" }`.
- **GIVEN** a `DELETE /api/marketing/products/:id` request **WHEN** the ID does not match any marketing record **THEN** the server returns 404 with `{ "message": "Product not found" }`.
- **GIVEN** a write endpoint is called **WHEN** the Authorization header is missing or contains an expired/invalid token **THEN** the server returns 401 with `{ "message": "Unauthorized" }`.
- **GIVEN** the `POST /api/test/reset` endpoint is called **WHEN** there is modified data in the DB **THEN** all data is replaced with the original seed data and the response confirms the reset.
- **GIVEN** a `PUT /api/products/:id` request **WHEN** fields are missing from the body **THEN** only provided fields are updated; omitted fields retain their current values.
- **GIVEN** port 3001 is already in use **WHEN** the server starts **THEN** Fastify logs a clear error message and exits.

## 8. Resolved Questions

- **Q1 (category filtering)**: Not needed. The frontend only uses `limit` and `sort` params.
- **Q2 (pagination)**: **Yes — implemented.** `GET /api/products` accepts `?limit=N&sort=asc|desc` and returns `{ products, meta: { limit, sort, total } }` matching the existing frontend `ICollection` shape.
- **Q3 (user shape)**: Keep the Fake Store API-compatible `UserDto` shape (with `name`, `address`, `phone`, `cartId`). The concept of a cart is unknown to this API — `cartId` is a static dummy value. Simplify in a separate task when the frontend API layer is updated.

## 9. Validation Rules

### Products — Create (`POST /api/products`)

| Field        | Type   | Required | Constraints                                   |
| ------------ | ------ | -------- | --------------------------------------------- |
| name         | string | yes      | min 1 char, max 200 chars                     |
| description  | string | yes      | min 1 char, max 2000 chars                    |
| price.amount | number | yes      | > 0                                           |
| price.code   | string | yes      | one of: `USD`, `EUR`, `GBP`                   |
| imageUrl     | string | yes      | valid URL format                              |
| category     | string | yes      | one of: `clothing`, `jewelery`, `electronics` |

### Products — Update (`PUT /api/products/:id`)

| Field       | Type   | Required | Constraints                            |
| ----------- | ------ | -------- | -------------------------------------- |
| name        | string | no       | min 1 char, max 200 chars if provided  |
| description | string | no       | min 1 char, max 2000 chars if provided |
| imageUrl    | string | no       | valid URL format if provided           |

### Products — Update Price (`PATCH /api/products/:id/price`)

| Field  | Type   | Required | Constraints                 |
| ------ | ------ | -------- | --------------------------- |
| amount | number | yes      | > 0                         |
| code   | string | yes      | one of: `USD`, `EUR`, `GBP` |

### Marketing — Create Product (`POST /api/marketing/products`)

| Field     | Type   | Required | Constraints       |
| --------- | ------ | -------- | ----------------- |
| productId | string | yes      | valid UUID format |

### Marketing — Rate Product (`PATCH /api/marketing/products/:id/rate`)

| Field  | Type   | Required | Constraints |
| ------ | ------ | -------- | ----------- |
| rating | number | yes      | >= 0, <= 5  |

### Auth — Login (`POST /api/auth/login`)

| Field    | Type   | Required | Constraints |
| -------- | ------ | -------- | ----------- |
| username | string | yes      | min 1 char  |
| password | string | yes      | min 1 char  |
