import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";
import type {
  CreateReviewBody,
  ListReviewsQuery,
  RatingDto,
  Review,
  UpdateReviewBody,
} from "@/modules/marketing/marketing.types.js";

export interface CreateMarketingBody {
  productId: string;
}

export interface RateProductBody {
  rating: number;
}

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
// star-rating UI keeps working without requiring the full reviews API.
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
      authorName: resolveAuthorName({ displayName, username }),
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

export async function listReviewsHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Querystring: ListReviewsQuery;
  }>,
  reply: FastifyReply
): Promise<void> {
  const limit = request.query.limit ?? 10;
  const sort = request.query.sort ?? "desc";
  const db = await getDb();

  const productExists = db.data.marketingProducts.some(
    (m) => m.id === request.params.id
  );
  if (!productExists) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const productReviews = db.data.reviews.filter(
    (r) => r.productId === request.params.id
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
  request: FastifyRequest<{ Params: { id: string; reviewId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const { id: productId, reviewId } = request.params;

  const productExists = db.data.marketingProducts.some(
    (m) => m.id === productId
  );
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
    Params: { id: string };
    Body: CreateReviewBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const productId = request.params.id;

  const productExists = db.data.marketingProducts.some(
    (m) => m.id === productId
  );
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
    Params: { id: string; reviewId: string };
    Body: UpdateReviewBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const { id: productId, reviewId } = request.params;

  const productExists = db.data.marketingProducts.some(
    (m) => m.id === productId
  );
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
  request: FastifyRequest<{ Params: { id: string; reviewId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const { id: productId, reviewId } = request.params;

  const productExists = db.data.marketingProducts.some(
    (m) => m.id === productId
  );
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
