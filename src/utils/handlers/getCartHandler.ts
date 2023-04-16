import { rest } from "msw";

import { CartFixture } from "utils/fixtures";
import { host } from "utils/http";

import { GetResolver } from "./resolvers";

export const getCartHandler = (resolver?: GetResolver) =>
  rest.get(`${host}/carts/:cartId`, (req, res, ctx) => {
    if (resolver) return resolver(req, res, ctx);

    return res(ctx.json(CartFixture.toStructure()));
  });
