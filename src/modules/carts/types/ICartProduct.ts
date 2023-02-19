import { IProduct } from "modules/products/types";

export interface ICartProduct extends IProduct {
  quantity: number;
}
