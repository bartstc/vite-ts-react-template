import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";
import type { Category, Currency } from "@/modules/products/products.types.js";

export interface ListQuery {
  limit?: number;
  sort?: "asc" | "desc";
}

export interface CreateBody {
  name: string;
  description: string;
  price: { amount: number; code: Currency };
  imageUrl: string;
  category: Category;
  stock?: number;
}

export interface UpdateBody {
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdatePriceBody {
  amount: number;
  code: Currency;
}

export async function listProductsHandler(
  request: FastifyRequest<{ Querystring: ListQuery }>,
  reply: FastifyReply
): Promise<void> {
  const limit = request.query.limit ?? 10;
  const sort = request.query.sort ?? "asc";
  const db = await getDb();

  const sorted = [...db.data.products].sort((a, b) => {
    const cmp = a.addedAt.localeCompare(b.addedAt);
    return sort === "asc" ? cmp : -cmp;
  });

  const products = sorted.slice(0, limit);

  reply.send({
    products,
    meta: { limit, sort, total: db.data.products.length },
  });
}

export async function getProductHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const product = db.data.products.find((p) => p.id === request.params.id);

  if (!product) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  reply.send(product);
}

export async function createProductHandler(
  request: FastifyRequest<{ Body: CreateBody }>,
  reply: FastifyReply
): Promise<void> {
  const { name, description, price, imageUrl, category, stock } = request.body;
  const db = await getDb();

  const product = {
    id: crypto.randomUUID(),
    name,
    description,
    price: { amount: price.amount, currency: price.code },
    imageUrl,
    category,
    stock: stock ?? 0,
    addedAt: new Date().toISOString(),
    updatedAt: null,
  };

  await db.update((data) => data.products.push(product));
  reply.code(201).send(product);
}

export async function updateProductHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateBody }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const index = db.data.products.findIndex((p) => p.id === request.params.id);

  if (index === -1) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const { name, description, imageUrl } = request.body;
  const existing = db.data.products[index];
  const updated = {
    ...existing,
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(imageUrl !== undefined && { imageUrl }),
    updatedAt: new Date().toISOString(),
  };

  await db.update((data) => {
    data.products[index] = updated;
  });

  reply.send(updated);
}

export async function updateProductPriceHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdatePriceBody }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const index = db.data.products.findIndex((p) => p.id === request.params.id);

  if (index === -1) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  const { amount, code } = request.body;
  const updated = {
    ...db.data.products[index],
    price: { amount, currency: code },
    updatedAt: new Date().toISOString(),
  };

  await db.update((data) => {
    data.products[index] = updated;
  });

  reply.send(updated);
}

export async function deleteProductHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const index = db.data.products.findIndex((p) => p.id === request.params.id);

  if (index === -1) {
    reply.code(404).send({ message: "Product not found" });
    return;
  }

  await db.update((data) => data.products.splice(index, 1));
  reply.code(204).send();
}
