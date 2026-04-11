import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";

export async function getMarketingProductHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const record = db.data.marketingProducts.find(
    (m) => m.id === request.params.id
  );

  if (!record) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  reply.send(record);
}

export interface CreateMarketingBody {
  productId: string;
}

export interface RateProductBody {
  rating: number;
}

export async function createMarketingProductHandler(
  request: FastifyRequest<{ Body: CreateMarketingBody }>,
  reply: FastifyReply
): Promise<void> {
  const { productId } = request.body;
  const db = await getDb();

  const existing = db.data.marketingProducts.find((m) => m.id === productId);
  if (existing) {
    reply.code(409).send({ message: "Marketing product already exists" });
    return;
  }

  const record = {
    id: productId,
    rating: { rate: 0, count: 0 },
    addedAt: new Date().toISOString(),
    updatedAt: null,
  };

  await db.update((data) => data.marketingProducts.push(record));
  reply.code(201).send(record);
}

export async function rateMarketingProductHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: RateProductBody }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const index = db.data.marketingProducts.findIndex(
    (m) => m.id === request.params.id
  );

  if (index === -1) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const { rate: oldRate, count: oldCount } =
    db.data.marketingProducts[index].rating;
  const newCount = oldCount + 1;
  const newRate =
    Math.round(((oldRate * oldCount + request.body.rating) / newCount) * 100) /
    100;

  const updated = {
    ...db.data.marketingProducts[index],
    rating: { rate: newRate, count: newCount },
    updatedAt: new Date().toISOString(),
  };

  await db.update((data) => {
    data.marketingProducts[index] = updated;
  });

  reply.send(updated);
}

export async function archiveMarketingProductHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const index = db.data.marketingProducts.findIndex(
    (m) => m.id === request.params.id
  );

  if (index === -1) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  await db.update((data) => data.marketingProducts.splice(index, 1));
  reply.code(204).send();
}
