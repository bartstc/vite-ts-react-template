import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  listProductsHandler,
  getProductHandler,
  createProductHandler,
  updateProductHandler,
  updateProductPriceHandler,
  deleteProductHandler,
} from "@/modules/products/products.handlers.js";
import {
  listProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
  updatePriceSchema,
} from "@/modules/products/products.schemas.js";

export async function productRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/api/products",
    { schema: { querystring: listProductsQuerySchema } },
    listProductsHandler
  );
  app.get("/api/products/:id", getProductHandler);
  app.post(
    "/api/products",
    { schema: { body: createProductSchema }, preHandler: authenticate },
    createProductHandler
  );
  app.put(
    "/api/products/:id",
    { schema: { body: updateProductSchema }, preHandler: authenticate },
    updateProductHandler
  );
  app.patch(
    "/api/products/:id/price",
    { schema: { body: updatePriceSchema }, preHandler: authenticate },
    updateProductPriceHandler
  );
  app.delete(
    "/api/products/:id",
    { preHandler: authenticate },
    deleteProductHandler
  );
}
