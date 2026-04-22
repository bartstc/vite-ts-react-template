import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";

import { initializeI18n } from "@/test-lib/init-i18n";
import { mswServer } from "@/test-lib/msw-server";

beforeAll(async () => {
  await initializeI18n();
  mswServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  cleanup();
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});
