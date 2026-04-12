import { Category } from "@/features/products/models/category";
import type { Product } from "@/features/products/models/product";
import { generateUuid } from "@/test-lib/generate-uuid";

import { createFixture } from "./create-fixture";

export const ProductFixture = createFixture<Product>({
  id: generateUuid(),
  name: "White Nike Shoes",
  category: Category.Clothing,
  price: { amount: 129.99, currency: "USD" },
  imageUrl:
    "https://images.unsplash.com/photo-1521903062400-b80f2cb8cb9d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, blanditiis cum debitis doloremque eos excepturi explicabo fuga fugiat hic illo natus nobis non, odio sequi similique ullam velit vitae voluptatibus?",
  addedAt: "2025-01-15T10:00:00.000Z",
});
