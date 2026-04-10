import type { FastifyInstance } from "fastify";
import { loginHandler, getUserHandler } from "@/modules/auth/auth.handlers.js";
import { loginBodySchema } from "@/modules/auth/auth.schemas.js";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    "/api/auth/login",
    { schema: { body: loginBodySchema } },
    loginHandler
  );
  app.get("/api/users/:id", getUserHandler);
}
