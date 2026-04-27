# Tests: Remove Product from Cart

Spec: `specs/001-remove-cart-product/spec.md`

---

## 1. New Support Infrastructure

### MSW Handler — `src/test-lib/handlers/delete-remove-cart-product-handler.ts`

Factory for `DELETE /carts/:cartId/products/:productId`. Same pattern as `delete-clear-cart-handler.ts`.

```ts
export const deleteRemoveCartProductHandler = (resolver?: DeleteResolver) =>
  http.delete(`${host}/carts/:cartId/products/:productId`, (req) => {
    if (resolver) return resolver(req);
    return HttpResponse.json({});
  });
```

No new fixture needed — existing `CartFixture` and `ProductFixture` are sufficient.

---

## 2. Hook Tests

### `src/features/carts/application/use-remove-cart-product.test.tsx`

Block: `hook-test`. Tests `useRemoveCartProduct` (application layer). Covers error paths and the `ProductNotFoundInCartError` distinction that are awkward to reproduce through UI stories.

Pattern source: `use-add-to-cart.test.tsx` (exact same structure).

**Setup:**

- `beforeEach`: `mswServer.use(deleteRemoveCartProductHandler())`
- `afterEach`: `useConfirmRemoveProductDialogStore.setState({ isOpen: false, selectedItem: null })`
- `wrapper`: `TestQueryProvider > TestAuthProvider`

**Scenarios:**

| #   | Description                              | MSW override                                      | Expected toast                                                                         |
| --- | ---------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | `removeOneFromCart` success              | none                                              | `type: "success"`, `"Product quantity decreased."`                                     |
| 2   | `removeOneFromCart` generic server error | `errorResponse(500, "Server error")`              | `type: "error"`, `"Something went wrong. Please try again or contact us."`             |
| 3   | `removeOneFromCart` product not found    | `errorResponse(404, "Product not found in cart")` | `type: "error"`, `"Product not found in your cart. It may have already been removed."` |
| 4   | `removeAllFromCart` success (qty=2)      | none (handler responds `{}` twice)                | `type: "success"`, `"Product removed from your cart."`                                 |
| 5   | `removeAllFromCart` mid-sequence error   | `errorResponse(500, "Server error")`              | `type: "error"`, `"Something went wrong. Please try again or contact us."`             |

**Note on scenario 3:** `ProductNotFoundInCartError` is triggered by `e.message === "Product not found in cart"` in `src/lib/api/carts/{cart-id}/remove-cart-product-mutation.ts:21`. Use `errorResponse(404, "Product not found in cart")`.

---

## 3. Component Story Tests

### `src/features/carts/components/CartItem.stories.tsx` (update)

Block: `component-story-test`. Verifies user-facing behavior: quantity controls UI, dialog trigger, confirmation flow, and cancel flow.

**Meta-level changes:**

- Add `parameters.msw.handlers: [deleteRemoveCartProductHandler()]`
- Add decorator rendering `<ConfirmRemoveProductDialog />` alongside `<Story />` so dialog portal is in the tree for all stories that trigger it

**Stories to add:**

| Story                | `quantity` | User action                              | Assert (via `screen`)                     |
| -------------------- | ---------- | ---------------------------------------- | ----------------------------------------- |
| `Default`            | 4          | — (baseline, no play)                    | —                                         |
| `DecrementDirectly`  | 4          | click `aria-label="Decrease quantity"`   | toast `"Product quantity decreased."`     |
| `DecrementLastUnit`  | 1          | click `aria-label="Decrease quantity"`   | dialog title `"Remove last item"` visible |
| `RemoveAllConfirmed` | 4          | click "Remove" → click "Yes, remove all" | toast `"Product removed from your cart."` |
| `RemoveAllCancelled` | 4          | click "Remove" → click "Cancel"          | dialog title no longer in DOM             |

**Query rules:**

- Buttons in the cart item → `canvas.getByRole("button", { name: ... })` or `canvas.getByRole("button", { name: /aria-label/i })`
- Dialog content, toast text → `screen.findBy*` (portaled)
- `await screen.findByRole("alertdialog")` to wait for dialog open; `waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())` to assert close

**MSW re-declaration reminder:** Story-level `parameters.msw.handlers` replaces meta-level. None of the stories above override, so all inherit `[deleteRemoveCartProductHandler()]` from meta.

---

## 4. Verification

```bash
pnpm test           # hook tests pass
pnpm typecheck      # no type errors
pnpm storybook      # play functions pass in Storybook UI
```
