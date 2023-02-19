interface IProduct {
  productId: number;
  quantity: number;
}

export interface ICart {
  id: number;
  userId: number;
  date: string;
  products: Array<IProduct>;
}
