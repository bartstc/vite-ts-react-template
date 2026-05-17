import type { User } from "@/modules/auth/auth.types.js";
import type { Product } from "@/modules/products/products.types.js";
import type {
  MarketingProduct,
  Review,
} from "@/modules/marketing/marketing.types.js";
import type { Cart } from "@/modules/carts/carts.types.js";

export interface DatabaseSchema {
  users: User[];
  products: Product[];
  marketingProducts: MarketingProduct[];
  carts: Cart[];
  reviews: Review[];
}

export const CATEGORIES = ["clothing", "jewelery", "electronics"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CURRENCIES = ["USD", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];
