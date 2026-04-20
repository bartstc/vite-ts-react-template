---
title: MSW Handler
category: Testing
layer: test-lib/handlers/
composedWith: fixture
---

## MSW Handler

One request handler per API endpoint. Returns a sensible default response when invoked without arguments; accepts an optional resolver for per-test overrides (error responses, custom payloads, assertions on the request). Shared across unit tests and Storybook stories.

### Constraints

- One file per endpoint. Filename mirrors HTTP verb + resource + action: `put-add-to-cart-handler.ts`, `get-products-handler.ts`.
- Export a **single named factory function** — not multiple outcome-specific exports. Per-scenario variation is expressed by passing a resolver at the call site.
- URL uses the shared `host` constant from `@/lib/http` and, for endpoints with query params, the shared `buildUrl` helper — never hand-concatenate URLs.
- Default response body is the minimum valid shape. For collection endpoints, use fixtures with `generateUuid()` IDs — do not inline literal arrays.

### Example — PUT handler

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

### Example — GET handler with query params and fixtures

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

### References

- `rules/fixture.md` — deterministic response payloads
- `rules/component-story-test.md` — handler usage in stories, including per-scenario resolver overrides
