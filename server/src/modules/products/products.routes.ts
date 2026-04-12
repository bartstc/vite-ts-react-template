import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  listProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  updateProductPriceHandler,
  deleteProductHandler,
  type ListQuery,
  type CreateBody,
  type UpdateBody,
  type UpdatePriceBody,
} from "@/modules/products/products.handlers.js";
import {
  listProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  updatePriceSchema,
} from "@/modules/products/products.schemas.js";

export async function productRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: ListQuery }>(
    "/api/products",
    { schema: { querystring: listProductsQuerySchema } },
    listProductsHandler
  );
  app.get<{ Params: { id: string } }>("/api/products/:id", getProductHandler);
  app.post<{ Body: CreateBody }>(
    "/api/products",
    { schema: { body: createProductSchema }, preHandler: authenticate },
    createProductHandler
  );
  app.put<{ Params: { id: string }; Body: UpdateBody }>(
    "/api/products/:id",
    { schema: { body: updateProductSchema }, preHandler: authenticate },
    updateProductHandler
  );
  app.patch<{ Params: { id: string }; Body: UpdatePriceBody }>(
    "/api/products/:id/price",
    { schema: { body: updatePriceSchema }, preHandler: authenticate },
    updateProductPriceHandler
  );
  app.delete<{ Params: { id: string } }>(
    "/api/products/:id",
    { preHandler: authenticate },
    deleteProductHandler
  );
}
