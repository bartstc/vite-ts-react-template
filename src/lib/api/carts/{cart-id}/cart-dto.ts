interface CartProduct {
  productId: string;
  quantity: number;
}

export interface CartDto {
  id: string;
  userId: number;
  date: string;
  products: CartProduct[];
}
