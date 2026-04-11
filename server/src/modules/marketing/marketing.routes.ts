import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  getMarketingProductHandler,
  createMarketingProductHandler,
  rateMarketingProductHandler,
  archiveMarketingProductHandler,
  type CreateMarketingBody,
  type RateProductBody,
} from "@/modules/marketing/marketing.handlers.js";
import {
  createMarketingProductSchema,
  rateProductSchema,
} from "@/modules/marketing/marketing.schemas.js";

export async function marketingRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { id: string } }>(
    "/api/marketing/products/:id",
    getMarketingProductHandler
  );
  app.post<{ Body: CreateMarketingBody }>(
    "/api/marketing/products",
    {
      schema: { body: createMarketingProductSchema },
      preHandler: authenticate,
    },
    createMarketingProductHandler
  );
  app.patch<{ Params: { id: string }; Body: RateProductBody }>(
    "/api/marketing/products/:id/rate",
    { schema: { body: rateProductSchema }, preHandler: authenticate },
    rateMarketingProductHandler
  );
  app.delete<{ Params: { id: string } }>(
    "/api/marketing/products/:id",
    { preHandler: authenticate },
    archiveMarketingProductHandler
  );
}
