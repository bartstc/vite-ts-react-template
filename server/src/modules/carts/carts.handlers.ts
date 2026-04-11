import type { FastifyReply, FastifyRequest } from "fastify";
import { getDb } from "@/db/database.js";

export async function getCartHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const cart = db.data.carts.find((c) => c.id === request.params.id);

  if (!cart) {
    reply.code(404).send({ message: "Cart not found" });
    return;
  }

  reply.send(cart);
}

export interface AddToCartBody {
  productId: string;
  quantity: number;
}

export async function addToCartHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: AddToCartBody;
  }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const index = db.data.carts.findIndex((c) => c.id === request.params.id);

  if (index === -1) {
    reply.code(404).send({ message: "Cart not found" });
    return;
  }

  const { productId, quantity } = request.body;
  const cart = db.data.carts[index];
  const productIndex = cart.products.findIndex(
    (p) => p.productId === productId
  );

  const updatedProducts =
    productIndex === -1
      ? [...cart.products, { productId, quantity }]
      : cart.products.map((p, i) =>
          i === productIndex ? { ...p, quantity: p.quantity + quantity } : p
        );

  const updated = {
    ...cart,
    products: updatedProducts,
    date: new Date().toISOString(),
  };

  await db.update((data) => {
    data.carts[index] = updated;
  });

  reply.send(updated);
}

export async function clearCartHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> {
  const db = await getDb();
  const index = db.data.carts.findIndex((c) => c.id === request.params.id);

  if (index === -1) {
    reply.code(404).send({ message: "Cart not found" });
    return;
  }

  const updated = {
    ...db.data.carts[index],
    products: [],
    date: new Date().toISOString(),
  };

  await db.update((data) => {
    data.carts[index] = updated;
  });

  reply.code(204).send();
}
