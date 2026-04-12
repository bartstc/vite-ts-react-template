import type { FastifyInstance } from "fastify";
import { resetDatabase } from "@/db/seed.js";

export async function testRoutes(app: FastifyInstance): Promise<void> {
  app.post("/api/test/reset", async (_request, reply) => {
    await resetDatabase();
    reply.send({ message: "Database reset to seed state" });
  });
}
