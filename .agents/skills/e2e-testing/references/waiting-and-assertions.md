# Waiting and Assertions

How a test waits for the app and checks the outcome. Applies to journey tests and to the readiness checks in page
objects.

## Constraints

- Locator actions (`click`, `fill`, `check`, …) and web-first assertions (`await expect(locator).to…`) are the only
  waiting mechanism.
- Never `waitForTimeout`, `waitForLoadState("networkidle")`, `waitUntil: "networkidle"`, `waitForSelector`, or a
  value read once and passed to `expect`.
- Each `test.step` ends with a web-first assertion on the state the next step needs.
- Assert what the user sees first: text, roles, visibility, enabled state, URL.
- A backend effect the UI does not show is checked through the API in the test with `expect.poll`.
- A negative assertion (`not.toBeVisible()`) needs a positive control in the same test.
- The last assertion of the test fails if the path broke.
- `page.waitForResponse` only when no UI reflects a result the next step depends on. It goes in the test, with the
  promise created **before** the action. Never in a page object.
- Match the meaningful part of text with a regex, not a whole sentence.

## Replacements

| Instead of                                | Use                                                       |
| ----------------------------------------- | --------------------------------------------------------- |
| `page.waitForTimeout(n)`                  | A web-first assertion on what the next step needs         |
| `waitForLoadState("networkidle")`         | `await expect(page.heading).toBeVisible()`                |
| `page.waitForSelector(".row")`            | `await expect(rows).not.toHaveCount(0)`                   |
| `expect(await el.isVisible()).toBe(true)` | `await expect(el).toBeVisible()`                          |
| `expect(await el.textContent()).toBe(x)`  | `await expect(el).toHaveText(x)`                          |
| `expect(await rows.count()).toBe(n)`      | `await expect(rows).toHaveCount(n)`                       |
| `expect(page.url()).toContain(x)`         | `await expect(page).toHaveURL(re)`                        |
| A loop polling a non-DOM value            | `await expect.poll(() => getStatus(request, id)).toBe(x)` |
| Retrying a block that must succeed        | `await expect(async () => { … }).toPass()`                |

## Example — readiness check and outcome

```ts
await test.step("add it to the cart", async () => {
  await productDetailsPage.addToCart();
  await expect(productDetailsPage.addedDialog.root).toBeVisible(); // state the next step needs
});

await test.step("the cart lists it", async () => {
  await productDetailsPage.addedDialog.goToCart();
  await expect(cartPage.item(product.title)).toBeVisible(); // the outcome the path exists for
});
```

## Example — negative assertion with a positive control

```ts
await expect(cartPage.heading).toBeVisible(); // positive control: the page rendered
await expect(cartPage.item(product.title)).not.toBeVisible();
```

## Example — backend effect the UI does not show

```ts
await expect
  .poll(async () => (await getCart(request, cartId)).products.length)
  .toBe(1);
```

## Example — waiting when the UI shows nothing

```ts
await test.step("change the quantity and reload", async () => {
  // no UI signal for the save — wait for the response before reloading
  const saved = page.waitForResponse(
    (r) => r.url().includes("/api/carts") && r.request().method() === "PUT"
  ); // created before the action
  await cartPage.setQuantity(product.title, 2);
  await saved;
  await page.reload();
  await expect(cartPage.quantity(product.title)).toHaveValue("2");
});
```
