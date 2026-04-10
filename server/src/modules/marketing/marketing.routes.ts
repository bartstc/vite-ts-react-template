import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  getMarketingProductHandler,
  createMarketingProductHandler,
  rateMarketingProductHandler,
  archiveMarketingProductHandler,
} from "@/modules/marketing/marketing.handlers.js";
import {
  createMarketingProductSchema,
  rateProductSchema,
} from "@/modules/marketing/marketing.schemas.js";

export async function marketingRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/marketing/products/:id", getMarketingProductHandler);
  app.post(
    "/api/marketing/products",
    {
      schema: { body: createMarketingProductSchema },
      preHandler: authenticate,
    },
    createMarketingProductHandler
  );
  app.patch(
    "/api/marketing/products/:id/rate",
    { schema: { body: rateProductSchema }, preHandler: authenticate },
    rateMarketingProductHandler
  );
  app.delete(
    "/api/marketing/products/:id",
    { preHandler: authenticate },
    archiveMarketingProductHandler
  );
}
