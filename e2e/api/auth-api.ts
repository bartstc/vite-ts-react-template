import type { APIRequestContext } from "@playwright/test";

import type { LoginDto } from "@/lib/api/auth/login/login-dto";
import { API_URL } from "@e2e/api/api-url";

/** Signs in through the API and returns the JWT for authorised seeding requests. */
export async function getAuthToken(
  request: APIRequestContext,
  credentials: LoginDto
): Promise<string> {
  const response = await request.post(`${API_URL}/auth/login`, {
    data: credentials,
  });
  if (!response.ok()) {
    throw new Error(
      `getAuthToken failed: ${response.status()} ${await response.text()}`
    );
  }
  return response.text();
}
