import { test as base } from "@playwright/test";

import { resetDatabase } from "@e2e/api/test-api";

export const test = base.extend<{ resetDb: void }>({
  // AIDEV-NOTE: resets the shared DB to seed before every test — requires a single worker (docs/e2e-testing.md §2.2)
  resetDb: [
    async ({ request }, use) => {
      await resetDatabase(request);
      await use();
    },
    { auto: true },
  ],
});
