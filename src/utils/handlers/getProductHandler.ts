import { rest } from "msw";

import { ProductFixture } from "utils/fixtures";
import { host } from "utils/http";

import { GetResolver } from "./resolvers";

export const getProductHandler = (resolver?: GetResolver) =>
  rest.get(`${host}/products/:productId`, (req, res, ctx) => {
    if (resolver) return resolver(req, res, ctx);

    return res(ctx.json(ProductFixture.toStructure()));
  });
