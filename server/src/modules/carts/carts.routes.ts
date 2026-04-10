import type { FastifyInstance } from "fastify";
import { authenticate } from "@/plugins/auth.js";
import {
  getCartHandler,
  addToCartHandler,
  clearCartHandler,
} from "@/modules/carts/carts.handlers.js";
import { addToCartSchema } from "@/modules/carts/carts.schemas.js";

export async function cartRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/carts/:id", getCartHandler);
  app.put(
    "/api/carts/:id",
    { schema: { body: addToCartSchema }, preHandler: authenticate },
    addToCartHandler
  );
  app.delete("/api/carts/:id", { preHandler: authenticate }, clearCartHandler);
}
