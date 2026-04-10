import { HttpService } from "./http-service";
import { KyClient } from "./ky-client";

const headers = {
  "Content-Type": "application/json",
};

// AIDEV-NOTE: VITE_API must be set to the local server base URL (e.g. http://localhost:3001/api)
export const host = import.meta.env.VITE_API as string;

export const httpService = new HttpService(
  new KyClient({ prefixUrl: host, headers })
);
