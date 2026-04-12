import { http, HttpResponse } from "msw";

import { buildUrl } from "@/lib/build-url";
import { host } from "@/lib/http";
import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";

import type { GetResolver } from "./resolvers";

export const getProductsHandler = (resolver?: GetResolver) =>
  http.get(
    `${host}/${buildUrl("products", { limit: 10, sort: "asc" })}`,
    (req) => {
      if (resolver) return resolver(req);

      return HttpResponse.json({
        products: ProductFixture.createCollection([
          { id: generateUuid() },
          { id: generateUuid() },
        ]),
        meta: { limit: 10, sort: "asc", total: 2 },
      });
    }
  );
