import type { Cart } from "@/features/carts/models/cart";
import { DateVO } from "@/lib/date/date";

import { createFixture } from "./create-fixture";

export const CartFixture = createFixture<Cart>({
  id: 1,
  date: DateVO.past(),
  userId: 1,
  products: [{ productId: 1, quantity: 2 }],
});
