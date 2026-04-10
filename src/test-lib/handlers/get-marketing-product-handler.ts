import { http, HttpResponse } from "msw";

import { host } from "@/lib/http";
import { MarketingProductFixture } from "@/test-lib/fixtures/marketing-product-fixture";

import type { GetResolver } from "./resolvers";

export const getMarketingProductHandler = (resolver?: GetResolver) =>
  http.get(`${host}/marketing/products/:productId`, (req) => {
    if (resolver) return resolver(req);

    return HttpResponse.json(MarketingProductFixture.toStructure());
  });
