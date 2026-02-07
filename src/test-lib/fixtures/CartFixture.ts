import type { ICart } from "@/features/carts/models/ICart";
import { DateVO } from "@/lib/date/Date";

import { createFixture } from "./createFixture";

export const CartFixture = createFixture<ICart>({
  id: 1,
  date: DateVO.past(),
  userId: 1,
  products: [{ productId: 1, quantity: 2 }],
});
