import { getDb } from "@/db/database.js";
import type { DatabaseSchema } from "@/shared/types.js";
import { seedUsers } from "@/db/seed-data/users.js";
import { seedProducts } from "@/db/seed-data/products.js";
import { seedMarketing } from "@/db/seed-data/marketing.js";
import { seedCarts } from "@/db/seed-data/carts.js";
import { seedReviews } from "@/db/seed-data/reviews.js";

// AIDEV-NOTE: deep-clone seed data so the live DB never aliases the imported seed
// arrays — otherwise handler mutations (e.g. carts) corrupt the seed source and reset
// stops restoring a clean state.
function freshSeed(): Pick<
  DatabaseSchema,
  "users" | "products" | "marketingProducts" | "carts" | "reviews"
> {
  return structuredClone({
    users: seedUsers,
    products: seedProducts,
    marketingProducts: seedMarketing,
    carts: seedCarts,
    reviews: seedReviews,
  });
}

export async function seedDatabase(): Promise<void> {
  const db = await getDb();
  const isEmpty =
    db.data.users.length === 0 &&
    db.data.products.length === 0 &&
    db.data.marketingProducts.length === 0 &&
    db.data.reviews.length === 0;

  if (isEmpty) {
    Object.assign(db.data, freshSeed());
    await db.write();
  }
}

export async function resetDatabase(): Promise<void> {
  const db = await getDb();
  Object.assign(db.data, freshSeed());
  await db.write();
}
