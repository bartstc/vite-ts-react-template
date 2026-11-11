import type { APIRequestContext } from "@playwright/test";

import { API_URL } from "@e2e/api/api-url";

export async function resetDatabase(request: APIRequestContext): Promise<void> {
  const response = await request.post(`${API_URL}/test/reset`);
  if (!response.ok()) {
    throw new Error(
      `resetDatabase failed: ${response.status()} ${await response.text()}`
    );
  }
}
