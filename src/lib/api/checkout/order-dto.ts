import type {
  CheckoutLineItem,
  Money,
  ShippingOption,
} from "@/lib/api/checkout/checkout-session-dto";

export interface Order {
  id: string;
  cartId: string;
  userId: number;
  status: "confirmed";
  lineItems: CheckoutLineItem[];
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
  promoCode: string | null;
  shippingOption: ShippingOption;
  confirmedAt: string;
}
