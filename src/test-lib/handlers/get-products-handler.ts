import { http, HttpResponse } from "msw";

import { buildUrl } from "@/lib/build-url";
import { host } from "@/lib/http";
import { ProductFixture } from "@/test-lib/fixtures/product-fixture";

import type { GetResolver } from "./resolvers";

export const getProductsHandler = (resolver?: GetResolver) =>
  http.get(
    `${host}/${buildUrl("products", { limit: 10, sort: "asc" })}`,
    (req) => {
      if (resolver) return resolver(req);

      return HttpResponse.json({
        products: ProductFixture.createCollection([
          { id: "4f968992-1aab-49c9-8913-09405915c1c0" },
          { id: "4f968992-1aab-49c9-8913-09405915c1c1" },
        ]),
        meta: { limit: 10, sort: "asc", total: 2 },
      });
    }
  );
