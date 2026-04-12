export interface RatingDto {
  rate: number;
  count: number;
}

export interface MarketingProduct {
  id: string;
  rating: RatingDto;
  addedAt: string;
  updatedAt: string | null;
}
