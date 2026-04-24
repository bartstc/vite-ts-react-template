## MSW Handler

One request handler per API endpoint. Returns a sensible default response when invoked without arguments; accepts an optional resolver for per-test overrides (error responses, custom payloads, assertions on the request). Shared across unit tests, hook tests, and Storybook stories.

### Constraints

- One file per endpoint. Filename mirrors HTTP verb + resource + action: `put-add-to-cart-handler.ts`, `get-products-handler.ts`.
- Export a **single named factory function** — not multiple outcome-specific exports. Per-scenario variation is passed as a resolver at the call site.
- URL uses the shared `host` constant from `@/lib/http`. For endpoints with query params, use the shared `buildUrl` helper — never hand-concatenate.
- Default response body is the minimum valid shape. For collection endpoints, populate via fixtures with `generateUuid()` IDs — no inline literal arrays.
- Query params go in the resolver via `new URL(request.url).searchParams`, not in the path predicate — MSW silently strips query strings from the predicate.
- Inline `mswServer.use(http.get(URL, resolver))` is acceptable for one-off test-local overrides. The factory pattern is for endpoints touched by ≥ 2 test files or by Storybook.

### `onUnhandledRequest` asymmetry

- **Vitest**: `'error'` — unexpected network calls should fail tests.
- **Storybook**: `'bypass'` — stories legitimately load fonts, images, analytics.

This asymmetry lives in the MSW server setup (`test-lib/msw-server.ts` and `.storybook/preview.ts`), not in individual handler files.

### Factory — PUT endpoint

```ts
import { http, HttpResponse } from "msw";

import { host } from "@/lib/http";

import type { PutResolver } from "./resolvers";

export const putAddToCartHandler = (resolver?: PutResolver) =>
  http.put(`${host}/carts/:cartId`, (req) => {
    if (resolver) return resolver(req);

    return HttpResponse.json({});
  });
```

### Factory — GET with query params and fixtures

```ts
import { http, HttpResponse } from "msw";

import { buildUrl } from "@/lib/build-url";
import { host } from "@/lib/http";
import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";

import type { GetResolver } from "./resolvers";

export const getProductsHandler = (resolver?: GetResolver) =>
  http.get(
    `${host}/${buildUrl("products", { limit: 10, sort: "asc" })}`,
    (req) => {
      if (resolver) return resolver(req);

      return HttpResponse.json({
        products: ProductFixture.createCollection([
          { id: generateUuid() },
          { id: generateUuid() },
        ]),
        meta: { limit: 10, sort: "asc", total: 2 },
      });
    }
  );
```

### Using handlers in consumers

**In a Vitest test** (unit or hook) — install a baseline in `beforeEach`; override per-test inline:

```ts
import { beforeEach } from "vitest";

import { errorResponse } from "@/test-lib/handlers/error-responses";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";
import { mswServer } from "@/test-lib/msw-server";

beforeEach(() => {
  mswServer.use(putAddToCartHandler());
});

it("handles server error", async () => {
  mswServer.use(
    putAddToCartHandler(() => errorResponse(400, "Unknown product"))
  );
  // ...
});
```

**In a Storybook story** — register handlers under `parameters.msw.handlers`. Story-level handlers **replace** meta-level handlers rather than merging:

```ts
const meta = {
  parameters: {
    msw: { handlers: [getProductsHandler(), putAddToCartHandler()] },
  },
} satisfies Meta<typeof Component>;

export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        getProductsHandler(() => errorResponse(500, "Boom")),
        putAddToCartHandler(), // re-declared to keep baseline
      ],
    },
  },
};
```

### Error simulation

```ts
HttpResponse.json({ message: "Boom" }, { status: 500 }); // 4xx/5xx with body
new HttpResponse(null, { status: 404 }); // empty-body error
HttpResponse.error(); // network error
await delay("infinite"); // hung request (loading state)
await delay(500); // realistic latency
```

### References

- `rules/fixture.md` — deterministic response payloads
- `rules/component-story-test.md` — handler usage in stories and the meta-vs-story replacement rule
- `rules/hook-test.md` — handler usage in `renderHook`-based tests
