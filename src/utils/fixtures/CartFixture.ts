import { dateVO } from "utils/format";

import { ICart } from "modules/carts/types";

import { createFixture } from "./createFixture";

export const CartFixture = createFixture<ICart>({
  id: 1,
  date: dateVO.past(),
  userId: 1,
  products: [{ productId: 1, quantity: 2 }],
});
