interface Product {
  productId: number;
  quantity: number;
}

export interface CartDto {
  id: number;
  userId: number;
  date: string;
  products: Product[];
}
