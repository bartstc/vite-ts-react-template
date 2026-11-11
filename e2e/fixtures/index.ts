import { mergeTests } from "@playwright/test";

import { test as data } from "@e2e/fixtures/data-fixture";
import { test as db } from "@e2e/fixtures/db-fixture";
import { test as pages } from "@e2e/fixtures/pages-fixture";

export const test = mergeTests(db, pages, data);
export { expect } from "@playwright/test";
