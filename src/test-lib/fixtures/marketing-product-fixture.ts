import type { MarketingProductDto } from "@/lib/api/marketing/{product-id}/marketing-product-dto";
import { generateUuid } from "@/test-lib/generate-uuid";

import { createFixture } from "./create-fixture";

export const MarketingProductFixture = createFixture<MarketingProductDto>({
  id: generateUuid(),
  rating: { rate: 3.8, count: 329 },
  addedAt: "2025-01-15T10:00:00.000Z",
  updatedAt: null,
});
