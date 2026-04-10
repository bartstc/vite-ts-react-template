import { getDb } from "@/db/database.js";
import { seedUsers } from "@/db/seed-data/users.js";
import { seedProducts } from "@/db/seed-data/products.js";
import { seedMarketing } from "@/db/seed-data/marketing.js";

export async function seedDatabase(): Promise<void> {
  const db = await getDb();
  const isEmpty =
    db.data.users.length === 0 &&
    db.data.products.length === 0 &&
    db.data.marketingProducts.length === 0;

  if (isEmpty) {
    db.data.users = seedUsers;
    db.data.products = seedProducts;
    db.data.marketingProducts = seedMarketing;
    await db.write();
  }
}

export async function resetDatabase(): Promise<void> {
  const db = await getDb();
  db.data.users = seedUsers;
  db.data.products = seedProducts;
  db.data.marketingProducts = seedMarketing;
  await db.write();
}
