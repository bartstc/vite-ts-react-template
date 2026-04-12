import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";
import type { LoginBody } from "@/modules/auth/auth.types.js";

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
): Promise<void> {
  const { username, password } = request.body;
  const db = await getDb();
  const user = db.data.users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    reply.code(401).send({ message: "Invalid username or password" });
    return;
  }

  const token = request.server.jwt.sign({
    userId: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
  });

  reply.send(token);
}

export async function getUserHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const id = parseInt(request.params.id, 10);
  const db = await getDb();
  const user = db.data.users.find((u) => u.id === id);

  if (!user) {
    reply.code(404).send({ message: "User not found" });
    return;
  }

  const { password: _password, ...userDto } = user;
  reply.send(userDto);
}
