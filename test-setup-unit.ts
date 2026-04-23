import { afterAll, afterEach, beforeAll } from "vitest";

import { mswServer } from "@/test-lib/msw-server";

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});
