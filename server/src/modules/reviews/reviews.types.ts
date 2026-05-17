export interface Review {
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

export interface CreateReviewBody {
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewBody {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ListReviewsQuery {
  limit?: number;
  sort?: "asc" | "desc";
}
