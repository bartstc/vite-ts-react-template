---
title: Component Story Test
category: Testing
layer: co-located `.stories.tsx`
composedWith: fixture, msw-handler
---

## Component Story Test

Storybook story with a `play` function that verifies component behavior through real user interactions — clicks, typing, selection, validation, conditional rendering. One story per meaningful state or flow; the `Default` story is the pure-rendering baseline.

### Constraints

- Co-located with the component. `FooForm.tsx` → `FooForm.stories.tsx`.
- `Default: Story = {}` is the pure-rendering baseline — no play function on `Default`. Named stories carry play functions.
- Play function phases are always wrapped in `step("label", async () => { ... })`. Phase labels read as prose ("Validate required fields", "Fill text fields", "Submit form").
- Query priorities (in order):
  1. `getByRole(role, { name })` — accessible-name queries
  2. `getByLabelText(label)` — form fields
  3. `getByText(text)` — visible content
  4. `getByTestId` — escape hatch only
- Use `canvas` (from `within(canvasElement)`) for elements rendered inside the component. Use `screen` for portaled content (Chakra UI combobox options, toasts, modals).
- `await screen.findBy*` for elements that appear after an interaction. `sleep(N)` only for Chakra UI combobox open/close transitions (typical: `100`–`150` ms).
- Callback props use `action("label")` from `storybook/actions`. Data in args uses fixtures (`ProductFixture.toStructure()`, `ProductFixture.createCollection([...])`) — not inline literals.
- Network-dependent stories declare MSW handlers under `parameters.msw.handlers`. Per-scenario overrides pass a resolver to the handler factory (see `rules/msw-handler.md`).
- New story vs. new step: new story when starting props/state differ; new step within the same story when continuing a single user flow.

### Example — pure rendering baseline

Follow the structure of this example (meta at top with `title`, `component`, `decorators`, `parameters`; `satisfies Meta<typeof Component>` — not a plain type annotation — to keep inference working for `StoryObj<typeof meta>`).

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

### Example — interaction flow with steps

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, screen, expect } from "storybook/test";

import { sleep } from "@/test-lib/storybook/sleep";

import { CheckoutForm } from "./CheckoutForm";

const meta = {
  title: "modules/Carts/CheckoutForm",
  component: CheckoutForm,
  parameters: { layout: "centered" },
} satisfies Meta<typeof CheckoutForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Purchasing: Story = {
  play: async ({ canvasElement, step }) => {
    within(canvasElement);

    await step("Enter credentials", async () => {
      await userEvent.type(screen.getByLabelText(/Full Name/i), "John Doe");
      await userEvent.type(
        screen.getByLabelText(/Address/i),
        "NYC Groove Street"
      );
      await userEvent.click(screen.getByRole("combobox"));
      await sleep(100);
      await userEvent.click(screen.getByRole("option", { name: "PayPal" }));
      await sleep(100);
    });

    await expect(screen.getByRole("combobox")).toHaveTextContent("PayPal");

    await step("Submit form", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "Complete Order" })
      );
    });

    await expect(
      await screen.findByText(
        "You have successfully purchased all selected products."
      )
    ).toBeInTheDocument();
  },
};
```

### Example — overriding MSW at call site

```tsx
// In a story's parameters block — simulate a 500 error for this story only
parameters: {
  msw: {
    handlers: [
      getProductsHandler(() =>
        HttpResponse.json({ message: "Server error" }, { status: 500 })
      ),
    ],
  },
}
```

### References

- `rules/msw-handler.md` — wire mocked endpoints under `parameters.msw.handlers`
- `rules/fixture.md` — deterministic data for `args`
- `rules/unit-test.md` — for pure-logic units (hooks, utilities) that do not require rendering
