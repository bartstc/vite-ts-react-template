import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AUTH_ENABLED, JWT_SECRET } from "@/config.js";

interface JwtUser {
  userId: number;
  username: string;
  email: string;
  displayName: string;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtUser;
    user: JwtUser;
  }
}

export function registerJwt(app: FastifyInstance): void {
  app.register(fastifyJwt, { secret: JWT_SECRET });
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!AUTH_ENABLED) return;
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ message: "Unauthorized" });
  }
}
