export interface RatingDto {
  rate: number;
  count: number;
}

export interface MarketingProduct {
  id: string;
  addedAt: string;
  updatedAt: string | null;
}

export interface MarketingProductDto extends MarketingProduct {
  rating: RatingDto;
}
