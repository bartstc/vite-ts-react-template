import { rest } from "msw";

import { buildUrl } from "utils";
import { ProductFixture } from "utils/fixtures";
import { host } from "utils/http";

import { GetResolver } from "./resolvers";

export const getProductsHandler = (resolver?: GetResolver) =>
  rest.get(
    `${host}/${buildUrl("products", { limit: 10, sort: "asc" })}`,
    (req, res, ctx) => {
      if (resolver) return resolver(req, res, ctx);

      return res(
        ctx.json(ProductFixture.createCollection([{ id: 1 }, { id: 2 }]))
      );
    }
  );
