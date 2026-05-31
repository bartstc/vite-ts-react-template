import type { Order } from "@/lib/api/checkout/order-dto";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";

import { createFixture } from "./create-fixture";

const usd = (amount: number) => ({ amount, currency: "USD" });

export const OrderFixture = createFixture<Order>({
  id: "00000000-0000-0000-0000-0000000000b1",
  cartId: USER_CART_ID,
  userId: 1,
  status: "confirmed",
  lineItems: [
    {
      productId: "4f968992-1aab-49c9-8913-09405915c1c0",
      name: "Test product",
      unitPrice: usd(10),
      quantity: 2,
      lineTotal: usd(20),
    },
  ],
  subtotal: usd(20),
  discount: usd(0),
  shipping: usd(5),
  total: usd(25),
  promoCode: null,
  shippingOption: "standard",
  confirmedAt: "2026-05-31T00:00:00.000Z",
});
