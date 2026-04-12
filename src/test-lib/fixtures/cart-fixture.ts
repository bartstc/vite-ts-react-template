import type { Cart } from "@/features/carts/models/cart";
import { DateVO } from "@/lib/date/date";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";

import { createFixture } from "./create-fixture";

export const CartFixture = createFixture<Cart>({
  id: USER_CART_ID,
  date: DateVO.past(),
  userId: 1,
  products: [
    { productId: "4f968992-1aab-49c9-8913-09405915c1c0", quantity: 2 },
  ],
});
