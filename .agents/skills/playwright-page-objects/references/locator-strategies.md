# Locator Strategies

Playwright's official recommendation: **prioritize `getByRole()` as your primary locator strategy**. This aligns with Testing Library philosophy and ensures tests verify user-facing behavior.

## Locator Priority Order

1. **`page.getByRole()`** — Highest priority for interactive elements
2. **`page.getByLabel()`** — Best for form inputs with labels
3. **`page.getByText()`** — For non-interactive content
4. **`page.getByPlaceholder()`** — When labels aren't available
5. **`page.getByTestId()`** — Escape hatch when semantics fail

## Anti-Pattern: Brittle CSS Selectors

```typescript
// ❌ BAD - Breaks when styling or DOM structure changes
await page
  .locator("#app > div.container > div.products > div:nth-child(2) > button")
  .click();
await page.locator(".btn-primary.add-to-cart").click();
```

## Recommended: Semantic, Resilient Selectors

```typescript
// ✅ GOOD - Survives refactoring, mirrors user perspective
await page.getByRole("button", { name: "Add to Cart" }).click();
await page
  .getByRole("listitem")
  .filter({ hasText: "Premium Headphones" })
  .getByRole("button", { name: "Add to Cart" })
  .click();
```

## Role-Based Examples

```typescript
// Buttons
page.getByRole("button", { name: "Submit" });
page.getByRole("button", { name: /add to cart/i });

// Links
page.getByRole("link", { name: "View Details" });

// Form elements
page.getByRole("textbox", { name: "Email" });
page.getByRole("checkbox", { name: "Remember me" });
page.getByRole("combobox", { name: "Country" });
page.getByRole("radio", { name: "Express shipping" });

// Navigation
page.getByRole("navigation");
page.getByRole("menuitem", { name: "Settings" });

// Headings
page.getByRole("heading", { name: "Product Details", level: 1 });

// Lists
page.getByRole("list");
page.getByRole("listitem");
```

## Label-Based for Forms

```typescript
// Preferred for form inputs
page.getByLabel("Email");
page.getByLabel("Password");
page.getByLabel("First Name");

// With exact matching
page.getByLabel("Email", { exact: true });
```

## When to Use data-testid

Use `data-testid` when there's no semantic alternative:

```typescript
// Elements without semantic meaning
readonly cartBadge = page.getByTestId('cart-item-count');
readonly productGrid = page.getByTestId('product-grid');
readonly loadingSpinner = page.getByTestId('loading');
```

### Custom Test ID Attribute

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    testIdAttribute: "data-pw", // Custom attribute
  },
});
```

## Filtering and Chaining

```typescript
// Filter by text content
page.getByRole("listitem").filter({ hasText: "Premium Headphones" });

// Chain locators
page
  .getByTestId("product-card")
  .filter({ hasText: "Headphones" })
  .getByRole("button", { name: "Add to Cart" });

// Get nth element
page.getByRole("listitem").nth(0);
page.getByRole("listitem").first();
page.getByRole("listitem").last();
```

## Waiting Strategies

```typescript
// Wait for element to be visible
await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();

// Wait for element to be enabled
await expect(page.getByRole("button", { name: "Submit" })).toBeEnabled();

// Wait for text to appear
await expect(page.getByText("Success")).toBeVisible();

// Wait for URL change
await page.waitForURL(/\/products\/\d+\/details/);
```
