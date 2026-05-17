import { JSONFilePreset } from "lowdb/node";
import { DB_PATH } from "@/config.js";
import type { DatabaseSchema } from "@/shared/types.js";

const defaultData: DatabaseSchema = {
  users: [],
  products: [],
  marketingProducts: [],
  carts: [],
  reviews: [],
};

type Db = Awaited<ReturnType<typeof JSONFilePreset<DatabaseSchema>>>;

let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (!db) {
    db = await JSONFilePreset<DatabaseSchema>(DB_PATH, defaultData);
  }
  return db;
}
