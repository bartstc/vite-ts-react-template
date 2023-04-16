import { rest } from "msw";

import { host } from "utils/http";

import { PutResolver } from "./resolvers";

export const getAddToCartHandler = (resolver?: PutResolver) =>
  rest.put(`${host}/carts/:cartId`, (req, res, ctx) => {
    if (resolver) return resolver(req, res, ctx);

    return res(ctx.json({}));
  });
