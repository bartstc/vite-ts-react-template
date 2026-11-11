import type { APIRequestContext } from "@playwright/test";

import type { MarketingProductDto } from "@/lib/api/marketing/{product-id}/marketing-product-dto";
import { API_URL } from "@e2e/api/api-url";

// AIDEV-NOTE: the product page also loads the marketing record — a product without one renders "not found"
export async function createMarketingProduct(
  request: APIRequestContext,
  token: string,
  productId: string
): Promise<MarketingProductDto> {
  const response = await request.post(`${API_URL}/marketing/products`, {
    data: { productId },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(
      `createMarketingProduct failed: ${response.status()} ${await response.text()}`
    );
  }
  // AIDEV-NOTE: Playwright types json() as any — the API contract is the DTO
  return (await response.json()) as MarketingProductDto;
}
