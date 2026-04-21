import { http, HttpResponse } from "msw";

import { host } from "@/lib/http";

import type { PatchResolver } from "./resolvers";

export const patchRateProductHandler = (resolver?: PatchResolver) =>
  http.patch(`${host}/marketing/products/:productId/rate`, (req) => {
    if (resolver) return resolver(req);

    return HttpResponse.json({ id: "1", rating: { rate: 4, count: 100 } });
  });
