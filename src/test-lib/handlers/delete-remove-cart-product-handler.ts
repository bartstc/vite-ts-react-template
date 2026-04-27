import { http, HttpResponse } from "msw";

import { host } from "@/lib/http";

import type { DeleteResolver } from "./resolvers";

export const deleteRemoveCartProductHandler = (resolver?: DeleteResolver) =>
  http.delete(`${host}/carts/:cartId/products/:productId`, (req) => {
    if (resolver) return resolver(req);

    return HttpResponse.json({});
  });
