import { HttpService } from "./http-service";
import { KyClient } from "./ky-client";

// AIDEV-NOTE: VITE_API must be set to the local server base URL (e.g. http://localhost:3001/api)
// AIDEV-NOTE: No global Content-Type header — ky sets it automatically via the `json:` option
export const host = import.meta.env.VITE_API as string;

// AIDEV-NOTE: ky 2 replaced `prefixUrl` with `baseUrl`, which resolves per URL semantics: without
// a trailing slash the last path segment is replaced, so `.../api` + `products` would drop `/api`.
// `host` itself stays unslashed — MSW handlers build their URL patterns from it.
export const httpService = new HttpService(
  new KyClient({ baseUrl: `${host}/` })
);
