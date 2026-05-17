import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  listReviewsHandler,
  getReviewHandler,
  createReviewHandler,
  updateReviewHandler,
  deleteReviewHandler,
  type CreateReviewBody,
  type ListReviewsQuery,
  type UpdateReviewBody,
} from "@/modules/reviews/reviews.handlers.js";
import {
  createReviewSchema,
  updateReviewSchema,
  listReviewsQuerySchema,
} from "@/modules/reviews/reviews.schemas.js";

export async function reviewRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { productId: string }; Querystring: ListReviewsQuery }>(
    "/api/products/:productId/reviews",
    { schema: { querystring: listReviewsQuerySchema } },
    listReviewsHandler
  );
  app.get<{ Params: { productId: string; reviewId: string } }>(
    "/api/products/:productId/reviews/:reviewId",
    getReviewHandler
  );
  app.post<{ Params: { productId: string }; Body: CreateReviewBody }>(
    "/api/products/:productId/reviews",
    { schema: { body: createReviewSchema }, preHandler: authenticate },
    createReviewHandler
  );
  app.put<{
    Params: { productId: string; reviewId: string };
    Body: UpdateReviewBody;
  }>(
    "/api/products/:productId/reviews/:reviewId",
    { schema: { body: updateReviewSchema }, preHandler: authenticate },
    updateReviewHandler
  );
  app.delete<{ Params: { productId: string; reviewId: string } }>(
    "/api/products/:productId/reviews/:reviewId",
    { preHandler: authenticate },
    deleteReviewHandler
  );
}
