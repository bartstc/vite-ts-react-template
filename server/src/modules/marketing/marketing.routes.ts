import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  getMarketingProductHandler,
  createMarketingProductHandler,
  rateMarketingProductHandler,
  archiveMarketingProductHandler,
  listReviewsHandler,
  getReviewHandler,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
  type CreateMarketingBody,
  type RateProductBody,
} from "@/modules/marketing/marketing.handlers.js";
import {
  createMarketingProductSchema,
  rateProductSchema,
  createReviewSchema,
  updateReviewSchema,
  listReviewsQuerySchema,
} from "@/modules/marketing/marketing.schemas.js";
import type {
  CreateReviewBody,
  ListReviewsQuery,
  UpdateReviewBody,
} from "@/modules/marketing/marketing.types.js";

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

  app.get<{ Params: { id: string }; Querystring: ListReviewsQuery }>(
    "/api/marketing/products/:id/reviews",
    { schema: { querystring: listReviewsQuerySchema } },
    listReviewsHandler
  );
  app.get<{ Params: { id: string; reviewId: string } }>(
    "/api/marketing/products/:id/reviews/:reviewId",
    getReviewHandler
  );
  app.post<{ Params: { id: string }; Body: CreateReviewBody }>(
    "/api/marketing/products/:id/reviews",
    { schema: { body: createReviewSchema }, preHandler: authenticate },
    createReviewHandler
  );
  app.put<{ Params: { id: string; reviewId: string }; Body: UpdateReviewBody }>(
    "/api/marketing/products/:id/reviews/:reviewId",
    { schema: { body: updateReviewSchema }, preHandler: authenticate },
    updateReviewHandler
  );
  app.delete<{ Params: { id: string; reviewId: string } }>(
    "/api/marketing/products/:id/reviews/:reviewId",
    { preHandler: authenticate },
    deleteReviewHandler
  );
}
