import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";
import type { RatingDto } from "@/modules/marketing/marketing.types.js";
import type {
  CreateReviewBody,
  ListReviewsQuery,
  Review,
  UpdateReviewBody,
} from "@/modules/reviews/reviews.types.js";

export type { CreateReviewBody, ListReviewsQuery, UpdateReviewBody };

export function computeRating(reviews: Review[], productId: string): RatingDto {
  const ratings = reviews
    .filter((r) => r.productId === productId)
    .map((r) => r.rating);
  const count = ratings.length;
  if (count === 0) return { rate: 0, count: 0 };
  const sum = ratings.reduce((a, b) => a + b, 0);
  return { rate: Math.round((sum / count) * 100) / 100, count };
}

function resolveAuthorName(user: {
  displayName?: string;
  username: string;
}): string {
  return user.displayName ?? user.username;
}

export async function listReviewsHandler(
  request: FastifyRequest<{
    Params: { productId: string };
    Querystring: ListReviewsQuery;
  }>,
  reply: FastifyReply
): Promise<void> {
  const limit = request.query.limit ?? 10;
  const sort = request.query.sort ?? "desc";
  const db = await getDb();

  const productExists = db.data.products.some(
    (p) => p.id === request.params.productId
  );
  if (!productExists) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const productReviews = db.data.reviews.filter(
    (r) => r.productId === request.params.productId
  );

  const sorted = [...productReviews].sort((a, b) => {
    const cmp = a.createdAt.localeCompare(b.createdAt);
    return sort === "asc" ? cmp : -cmp;
  });

  const reviews = sorted.slice(0, limit);

  reply.send({
    reviews,
    meta: { limit, sort, total: productReviews.length },
  });
}

export async function getReviewHandler(
  request: FastifyRequest<{ Params: { productId: string; reviewId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const { productId, reviewId } = request.params;

  const productExists = db.data.products.some((p) => p.id === productId);
  if (!productExists) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const review = db.data.reviews.find(
    (r) => r.id === reviewId && r.productId === productId
  );

  if (!review) {
    reply.code(404).send({ message: "Review not found" });
    return;
  }

  reply.send(review);
}

export async function createReviewHandler(
  request: FastifyRequest<{
    Params: { productId: string };
    Body: CreateReviewBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const { productId } = request.params;

  const productExists = db.data.products.some((p) => p.id === productId);
  if (!productExists) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const { userId, displayName, username } = request.user;

  const duplicate = db.data.reviews.find(
    (r) => r.productId === productId && r.userId === userId
  );
  if (duplicate) {
    reply
      .code(409)
      .send({ message: "Review already exists for this user and product" });
    return;
  }

  const { rating, title, comment } = request.body;
  const review: Review = {
    id: crypto.randomUUID(),
    productId,
    userId,
    authorName: resolveAuthorName({ displayName, username }),
    rating,
    title: title ?? "",
    comment: comment ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  await db.update((data) => data.reviews.push(review));
  reply.code(201).send(review);
}

export async function updateReviewHandler(
  request: FastifyRequest<{
    Params: { productId: string; reviewId: string };
    Body: UpdateReviewBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const { productId, reviewId } = request.params;

  const productExists = db.data.products.some((p) => p.id === productId);
  if (!productExists) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const index = db.data.reviews.findIndex(
    (r) => r.id === reviewId && r.productId === productId
  );
  if (index === -1) {
    reply.code(404).send({ message: "Review not found" });
    return;
  }

  const existing = db.data.reviews[index];
  if (existing.userId !== request.user.userId) {
    reply.code(403).send({ message: "Not the review author" });
    return;
  }

  const { rating, title, comment } = request.body;
  const updated: Review = {
    ...existing,
    ...(rating !== undefined && { rating }),
    ...(title !== undefined && { title }),
    ...(comment !== undefined && { comment }),
    updatedAt: new Date().toISOString(),
  };

  await db.update((data) => {
    data.reviews[index] = updated;
  });

  reply.send(updated);
}

export async function deleteReviewHandler(
  request: FastifyRequest<{ Params: { productId: string; reviewId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const { productId, reviewId } = request.params;

  const productExists = db.data.products.some((p) => p.id === productId);
  if (!productExists) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const index = db.data.reviews.findIndex(
    (r) => r.id === reviewId && r.productId === productId
  );
  if (index === -1) {
    reply.code(404).send({ message: "Review not found" });
    return;
  }

  if (db.data.reviews[index].userId !== request.user.userId) {
    reply.code(403).send({ message: "Not the review author" });
    return;
  }

  await db.update((data) => data.reviews.splice(index, 1));
  reply.code(204).send();
}
