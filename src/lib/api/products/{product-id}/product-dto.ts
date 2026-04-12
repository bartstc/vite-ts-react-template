export enum Category {
  Clothing = "clothing",
  Jewelery = "jewelery",
  Electronics = "electronics",
}

export interface Price {
  amount: number;
  currency: string;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  category: Category;
  imageUrl: string;
  price: Price;
  addedAt: string;
}
