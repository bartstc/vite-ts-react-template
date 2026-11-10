## API Test

_Subject: a `lib/api/` query or mutation factory · File: co-located `<factory>.test.ts`_

Vitest test of a `src/lib/api/` factory through MSW. Two questions only: **did it send the right request**, and **did it
map each failure to the right domain error**. Not what the UI does with either — that is the hook or story's job.

MSW plays the backend; the factory and the HTTP client run for real.

Write one only when the factory's error mapping has branches. A factory that just forwards a request is covered
transitively by the hook or story that consumes it.

### Constraints

- **Run the factory through a real `QueryClient`** with `retry: false`, not by calling `mutationFn` / `queryFn` by hand.
- **Mock nothing in `lib/`.** MSW is the only double.
- **Assert the request exactly**: capture method, path params and body in the handler resolver and compare the whole
  object with `toEqual`. That is the half of the contract nothing type-checks.
- **One test per branchable failure, asserting the error class**, never the message.
- **Cover the fall-through**: an unrecognised failure and a network error.
- **Assert context fields on the error** that the UI shows.
- **Do not assert logging.** Spy on the logger only to silence output.

### Helper

`executeMutation` does not exist yet — add it to `src/test-lib/execute-mutation.ts` with the first `api-test` that needs
it:

```ts
import { QueryClient, type MutationOptions } from "@tanstack/react-query";

export const executeMutation = <TData, TVariables>(
  options: MutationOptions<TData, Error, TVariables>,
  variables: TVariables
) => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return client.getMutationCache().build(client, options).execute(variables);
};
```

### Example — mutation factory

```ts
import { http, HttpResponse } from "msw";

import {
  addToCartMutationOptions,
  ProductNotAvailableError,
  UnknownProductError,
  type AddToCartDto,
} from "@/lib/api/carts/{cart-id}/add-to-cart-mutation";
import { host } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";
import { executeMutation } from "@/test-lib/execute-mutation";
import { errorResponse } from "@/test-lib/handlers/error-responses";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";
import { mswServer } from "@/test-lib/msw-server";

const DTO: AddToCartDto = {
  cartId: "cart-1",
  payload: { productId: "product-1", quantity: 1 },
};

const addToCart = () => executeMutation(addToCartMutationOptions, DTO);

describe("addToCartMutationOptions", () => {
  beforeEach(() => {
    vi.spyOn(Logger, "error").mockImplementation(() => undefined); // silence only
  });

  afterEach(() => vi.restoreAllMocks());

  it("sends the payload to the cart", async () => {
    let request: unknown;
    mswServer.use(
      http.put(`${host}/carts/:cartId`, async ({ params, request: req }) => {
        request = { cartId: params.cartId, body: await req.json() };
        return HttpResponse.json({});
      })
    );

    await addToCart();

    expect(request).toEqual({ cartId: DTO.cartId, body: DTO.payload });
  });

  it.each([
    ["Unknown product", UnknownProductError],
    ["Product not available", ProductNotAvailableError],
  ])("maps %s to its domain error", async (message, ErrorClass) => {
    mswServer.use(putAddToCartHandler(() => errorResponse(400, message)));

    await expect(addToCart()).rejects.toBeInstanceOf(ErrorClass);
  });

  it("falls back to UnknownError for an unrecognised failure", async () => {
    mswServer.use(putAddToCartHandler(() => errorResponse(500, "Boom")));

    await expect(addToCart()).rejects.toBeInstanceOf(UnknownError);
  });

  it("falls back to UnknownError on a network error", async () => {
    mswServer.use(putAddToCartHandler(() => HttpResponse.error()));

    await expect(addToCart()).rejects.toBeInstanceOf(UnknownError);
  });
});
```

### Example — query factory

Target shape per `building-blocks` → `query-options-factory` (404 mapped, everything else rethrown). Existing query
factories predate that rule, so `ProductNotFoundError` is illustrative:

```ts
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

it("maps 404 to ProductNotFoundError", async () => {
  mswServer.use(
    getProductHandler(() => errorResponse(404, "Product not found"))
  );

  await expect(
    client.fetchQuery(productQuery(PRODUCT_ID))
  ).rejects.toBeInstanceOf(ProductNotFoundError);
});

it("rethrows an unmapped failure unchanged so the error page can handle it", async () => {
  mswServer.use(getProductHandler(() => errorResponse(500, "Boom")));

  await expect(
    client.fetchQuery(productQuery(PRODUCT_ID))
  ).rejects.toMatchObject({ name: "AjaxError", status: 500 });
});
```

### Anti-patterns

❌ Asserting the message instead of the class — server messages get reworded; the class is the contract:

```ts
await expect(addToCart()).rejects.toThrow("Unknown product"); // ❌
```

❌ Mocking the layer under test: `vi.mock("@/lib/http")`, `vi.mock(".../add-to-cart-mutation")`.

❌ Asserting the logger: `expect(Logger.error).toHaveBeenCalledWith(...)`.

❌ Only the happy path. Error mapping is the factory's reason to exist; the request is one line of it.

❌ Duplicating the mapping matrix in hook tests or stories. They assert what the user sees for one or two errors; the
full mapping lives here.

### References

- `rules/msw-handler.md` — handler factories and error responses
- `rules/hook-test.md` — what the consuming hook does with each domain error
- `building-blocks` → `rules/mutation-options-factory.md`, `rules/query-options-factory.md` — the subject's shape
