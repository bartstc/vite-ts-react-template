// AIDEV-NOTE: Domain models re-exported from the API DTOs — shapes are identical to the
// wire format, so no mapping layer (frontend-model rule: re-export when identical). See 003.
export type {
  CheckoutLineItem,
  CheckoutSession,
  CheckoutStatus,
  Money,
  OutOfStockItem,
  PriceChange,
  ShippingOption,
} from "@/lib/api/checkout/checkout-session-dto";
export { SHIPPING_OPTIONS } from "@/lib/api/checkout/checkout-session-dto";
