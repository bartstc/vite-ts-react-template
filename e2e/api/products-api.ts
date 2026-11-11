import type { APIRequestContext } from "@playwright/test";

import type { ProductsListDto } from "@/lib/api/products/products-list/products-list-dto";
import type { ProductDto } from "@/lib/api/products/{product-id}/product-dto";
import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { API_URL } from "@e2e/api/api-url";

// AIDEV-NOTE: mirrors the server's products CreateBody — the app never creates products, so src/ has no request DTO
export interface CreateProductRequest {
  name: string;
  description: string;
  imageUrl: string;
  category: ProductDto["category"];
  price: { amount: number; code: string };
  stock?: number;
}

export async function createProduct(
  request: APIRequestContext,
  token: string,
  overrides: Partial<CreateProductRequest> = {}
): Promise<ProductDto> {
  const { name, description, imageUrl, category, price } =
    ProductFixture.toStructure();
  const body: CreateProductRequest = {
    name,
    description,
    imageUrl,
    category,
    price: { amount: price.amount, code: price.currency },
    stock: 10,
    ...overrides,
  };

  const response = await request.post(`${API_URL}/products`, {
    data: body,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(
      `createProduct failed: ${response.status()} ${await response.text()}`
    );
  }
  // AIDEV-NOTE: Playwright types json() as any — the API contract is the DTO
  return (await response.json()) as ProductDto;
}

export async function listProducts(
  request: APIRequestContext
): Promise<ProductDto[]> {
  const response = await request.get(`${API_URL}/products`);
  if (!response.ok()) {
    throw new Error(
      `listProducts failed: ${response.status()} ${await response.text()}`
    );
  }
  const body = (await response.json()) as ProductsListDto;
  return body.products;
}
