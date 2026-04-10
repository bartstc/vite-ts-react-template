import type { Category, Currency } from "@/shared/types.js";

export type { Category, Currency };

export interface MoneyDto {
  amount: number;
  currency: Currency;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: MoneyDto;
  imageUrl: string;
  category: Category;
  addedAt: string;
  updatedAt: string | null;
}

export type ProductDto = Product;
