export interface CartProduct {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: number;
  date: string;
  products: CartProduct[];
}
