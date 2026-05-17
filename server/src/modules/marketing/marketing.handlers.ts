import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";
import { computeRating } from "@/modules/reviews/reviews.handlers.js";
import type { Review } from "@/modules/reviews/reviews.types.js";

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

  reply.send({
    ...record,
    rating: computeRating(db.data.reviews, record.id),
  });
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
    addedAt: new Date().toISOString(),
    updatedAt: null,
  };

  await db.update((data) => data.marketingProducts.push(record));
  reply.code(201).send({
    ...record,
    rating: computeRating(db.data.reviews, record.id),
  });
}

// AIDEV-NOTE: compat shim — upserts the caller's review (title/comment empty) so the
// star-rating UI keeps working without exposing the full reviews API. Reviews remain
// the source of truth; the aggregate returned is computed.
export async function rateMarketingProductHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: RateProductBody }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const marketingIndex = db.data.marketingProducts.findIndex(
    (m) => m.id === request.params.id
  );

  if (marketingIndex === -1) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const { userId, displayName, username } = request.user;
  const productId = request.params.id;
  const now = new Date().toISOString();

  const reviewIndex = db.data.reviews.findIndex(
    (r) => r.productId === productId && r.userId === userId
  );

  if (reviewIndex === -1) {
    const newReview: Review = {
      id: crypto.randomUUID(),
      productId,
      userId,
      authorName: displayName ?? username,
      rating: request.body.rating,
      title: "",
      comment: "",
      createdAt: now,
      updatedAt: null,
    };
    await db.update((data) => {
      data.reviews.push(newReview);
      data.marketingProducts[marketingIndex] = {
        ...data.marketingProducts[marketingIndex],
        updatedAt: now,
      };
    });
  } else {
    await db.update((data) => {
      data.reviews[reviewIndex] = {
        ...data.reviews[reviewIndex],
        rating: request.body.rating,
        updatedAt: now,
      };
      data.marketingProducts[marketingIndex] = {
        ...data.marketingProducts[marketingIndex],
        updatedAt: now,
      };
    });
  }

  const updated = db.data.marketingProducts[marketingIndex];
  reply.send({
    ...updated,
    rating: computeRating(db.data.reviews, productId),
  });
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
