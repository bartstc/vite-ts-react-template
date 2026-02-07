import { http, HttpResponse } from "msw";

import { host } from "@/lib/http";

import type { DeleteResolver } from "./resolvers";

export const getClearCartHandler = (resolver?: DeleteResolver) =>
  http.delete(`${host}/carts/:cartId`, (req) => {
    if (resolver) return resolver(req);

    return HttpResponse.json({});
  });
