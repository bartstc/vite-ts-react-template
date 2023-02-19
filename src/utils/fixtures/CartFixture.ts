import { ICart } from "modules/carts/types";

import { createFixture } from "./createFixture";

export const CartFixture = createFixture<ICart>({
  id: 1,
  date: "2020-10-10",
  userId: 1,
  products: [{ productId: 1, quantity: 2 }],
});
