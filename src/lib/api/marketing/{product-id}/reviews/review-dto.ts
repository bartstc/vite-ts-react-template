export interface ReviewDto {
  id: string;
  productId: string;
  userId: number;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ListReviewsDto {
  reviews: ReviewDto[];
  meta: {
    limit: number;
    sort: "asc" | "desc";
    total: number;
  };
}
