import ky from "ky";

import { host } from "@/lib/http";

import type { LoginDto } from "./login-dto";

// AIDEV-NOTE: server returns the JWT as text/plain, not JSON — use .text() directly
export const loginUser = (body: LoginDto): Promise<string> => {
  return ky.post(`${host}/auth/login`, { json: body }).text();
};
