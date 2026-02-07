export enum Category {
  Men_clothing = "men's clothing",
  Women_clothing = "women's clothing",
  Jewelery = "jewelery",
  Electronics = "electronics",
}

export interface Rating {
  rate: number;
  count: number;
}

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  category: Category;
  image: string;
  price: number;
  rating: Rating;
}
