import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export function registerCors(app: FastifyInstance): void {
  app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}
