## Component Story Test

Storybook story with a `play` function that verifies component behavior through real user interactions — clicks, typing, selection, validation, conditional rendering. Focus on happy paths and main user-observable states; edge cases and error branches of composed hooks belong in a dedicated hook test when they are awkward to reproduce through UI.

One story per meaningful state or flow. The `Default` story is the pure-rendering baseline.

### Constraints

- Co-located with the component. `FooForm.tsx` → `FooForm.stories.tsx`.
- `Default: Story = {}` is the pure-rendering baseline — no play function on `Default`. Named stories carry play functions.
- Play context provides pre-scoped `canvas` and pre-bound `userEvent`: `play: async ({ canvas, userEvent, step, args }) => {...}`. Do not call `within(canvasElement)` or `userEvent.setup()`.
- Every `expect`, `userEvent.*`, and `findBy*` is `await`-ed.
- Phases are wrapped in `step("label", async () => { ... })`. Labels read as prose ("Validate required fields", "Fill text fields", "Submit form").
- Query priority:
  1. `getByRole(role, { name })` / `findByRole` — accessible-name queries
  2. `getByLabelText` — form fields
  3. `getByText` — visible content
  4. `getByTestId` — escape hatch; prefer adding `aria-label` or role to the component
- **Portaled content uses `screen`, not `canvas`.** Chakra `Menu`, `Popover`, `Dialog`, `Tooltip`, `Toaster`, `Combobox` listbox, `Select`, and toasts all render into `document.body`. The trigger is in `canvas`; the panel that opens is in `screen`.
- Async UI is handled with `await screen.findBy*` / `await canvas.findBy*` or `waitFor`. **NEVER** use `sleep(ms)` or `setTimeout` — every sleep is a missing `findBy*` or `waitFor`.
- Spy args use `fn()` from `storybook/test`: `args: { onSubmit: fn() }`, then `expect(args.onSubmit).toHaveBeenCalledWith(...)`. Use `action("label")` from `storybook/actions` only for manually logging non-arg events.
- Data in `args` uses fixtures (`ProductFixture.toStructure()`, `ProductFixture.createCollection([...])`). No inline literals when a fixture exists.
- One scenario per story. A play function with 10+ steps is almost always two stories. New story when starting props/state differ; new step within the same story when continuing a single user flow.
- **Do not mock composed hooks** (`vi.mock('./use-products-query')`). The story exercises the real hook; mock the endpoint the hook calls via `parameters.msw.handlers`. See `rules/msw-handler.md`.
- Use `getByRole("combobox")` not `getByLabelText` for Chakra Select triggers in play functions

### MSW in stories — meta vs story handlers

Register shared baseline handlers at the meta level; override per-story via `parameters.msw.handlers`.

**Story-level `parameters.msw.handlers` replaces the meta-level array — it does not merge.** A story that adds one override must re-declare the full baseline it still needs. Forgetting this is the #1 Storybook + MSW footgun.

```tsx
// Pattern A — re-declare baseline inline (simplest, good up to ~3 handlers)
const meta = {
  parameters: {
    msw: { handlers: [getProductsHandler(), putAddToCartHandler()] },
  },
} satisfies Meta<typeof ProductsList>;

export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        getProductsHandler(() => errorResponse(500, "Server error")),
        putAddToCartHandler(), // must re-declare to keep baseline
      ],
    },
  },
};
```

For per-scenario behavior variation, pass a resolver to the handler factory — see `rules/msw-handler.md`.

### Example — pure rendering baseline

Meta uses `satisfies Meta<typeof Component>` (not a plain type annotation) so `StoryObj<typeof meta>` infers `args` correctly.

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";

import { ProductsList } from "./ProductsList";

const meta = {
  title: "modules/Products/ProductsList",
  component: ProductsList,
  decorators: [withRouter],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ProductsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    products: ProductFixture.createCollection([
      { id: generateUuid() },
      { id: generateUuid() },
      { id: generateUuid() },
    ]),
  },
};

export const WithoutProducts: Story = {
  args: { products: [] },
};
```

### Example — interaction flow with portaled combobox

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";

import { CheckoutForm } from "./CheckoutForm";

const meta = {
  title: "modules/Carts/CheckoutForm",
  component: CheckoutForm,
  parameters: { layout: "centered" },
  args: { onComplete: fn() },
} satisfies Meta<typeof CheckoutForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Purchasing: Story = {
  play: async ({ canvas, userEvent, step, args }) => {
    await step("Enter credentials", async () => {
      await userEvent.type(canvas.getByLabelText(/Full Name/i), "John Doe");
      await userEvent.type(
        canvas.getByLabelText(/Address/i),
        "NYC Groove Street"
      );
      await userEvent.click(canvas.getByRole("combobox"));
      await userEvent.click(
        await screen.findByRole("option", { name: "PayPal" })
      );
    });

    await expect(canvas.getByRole("combobox")).toHaveTextContent("PayPal");

    await step("Submit form", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Complete Order" })
      );
    });

    await expect(
      await canvas.findByText(/successfully purchased/i)
    ).toBeInTheDocument();
    await expect(args.onComplete).toHaveBeenCalledOnce();
  },
};
```

### Example — MSW-backed story with story-level override

```tsx
import { getProductsHandler } from "@/test-lib/handlers/get-products-handler";
import { errorResponse } from "@/test-lib/handlers/error-responses";

export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [getProductsHandler(() => errorResponse(500, "Server error"))],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("alert")).toHaveTextContent(/failed/i);
  },
};
```

### References

- `rules/msw-handler.md` — handler factories, resolver overrides
- `rules/fixture.md` — deterministic data for `args`
- `rules/hook-test.md` — for hook edge cases that are awkward to reproduce through UI
- `rules/unit-test.md` — for pure-logic units (mappers, transformers, value objects)
