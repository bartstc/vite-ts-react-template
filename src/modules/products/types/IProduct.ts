import { Category } from "./Category";
import { IRating } from "./IRating";

export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: Category;
  image: string;
  price: number;
  rating: IRating;
}
