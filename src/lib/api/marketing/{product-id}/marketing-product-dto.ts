export interface RatingDto {
  rate: number;
  count: number;
}

export interface MarketingProductDto {
  id: string;
  rating: RatingDto;
  addedAt: string;
  updatedAt: string | null;
}
