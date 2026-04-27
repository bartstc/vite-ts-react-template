import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  getCartHandler,
  addToCartHandler,
  clearCartHandler,
  removeCartProductHandler,
  type AddToCartBody,
} from "@/modules/carts/carts.handlers.js";
import { addToCartSchema } from "@/modules/carts/carts.schemas.js";

export async function cartRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { id: string } }>("/api/carts/:id", getCartHandler);
  app.put<{ Params: { id: string }; Body: AddToCartBody }>(
    "/api/carts/:id",
    { schema: { body: addToCartSchema }, preHandler: authenticate },
    addToCartHandler
  );
  app.delete<{ Params: { id: string } }>(
    "/api/carts/:id",
    { preHandler: authenticate },
    clearCartHandler
  );
  app.delete<{ Params: { id: string; productId: string } }>(
    "/api/carts/:id/products/:productId",
    { preHandler: authenticate },
    removeCartProductHandler
  );
}
