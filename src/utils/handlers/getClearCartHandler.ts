import { rest } from "msw";

import { host } from "utils/http";

import { DeleteResolver } from "./resolvers";

export const getClearCartHandler = (resolver?: DeleteResolver) =>
  rest.delete(`${host}/carts/:cartId`, (req, res, ctx) => {
    if (resolver) return resolver(req, res, ctx);

    return res(ctx.json({}));
  });
