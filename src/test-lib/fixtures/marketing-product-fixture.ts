import type { MarketingProductDto } from "@/lib/api/marketing/{product-id}/marketing-product-dto";

import { createFixture } from "./create-fixture";

export const MarketingProductFixture = createFixture<MarketingProductDto>({
  id: "4f968992-1aab-49c9-8913-09405915c1c0",
  rating: { rate: 3.8, count: 329 },
  addedAt: "2025-01-15T10:00:00.000Z",
  updatedAt: null,
});
