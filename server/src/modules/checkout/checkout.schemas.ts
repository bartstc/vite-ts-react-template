const CURRENCIES = ["USD", "EUR", "GBP"];
const SHIPPING_OPTIONS = ["standard", "express"];

const UUID_PATTERN =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";

const money = {
  type: "object",
  required: ["amount", "currency"],
  properties: {
    amount: { type: "number", minimum: 0 },
    currency: { type: "string", enum: CURRENCIES },
  },
  additionalProperties: false,
};

const lineItem = {
  type: "object",
  required: ["productId", "name", "unitPrice", "quantity", "lineTotal"],
  properties: {
    productId: { type: "string" },
    name: { type: "string" },
    unitPrice: money,
    quantity: { type: "integer", minimum: 1 },
    lineTotal: money,
  },
  additionalProperties: false,
};

// AIDEV-NOTE: the session is client-held and replayed; validate its shape on the way
// back in so apply/confirm can trust its structure before re-pricing.
const session = {
  type: "object",
  required: [
    "id",
    "cartId",
    "status",
    "lineItems",
    "promoCode",
    "shippingOption",
    "subtotal",
    "discount",
    "shipping",
    "total",
    "expiresAt",
  ],
  properties: {
    id: { type: "string" },
    cartId: { type: "string" },
    status: { type: "string", enum: ["pending", "confirmed"] },
    lineItems: { type: "array", items: lineItem },
    promoCode: { type: ["string", "null"] },
    shippingOption: { type: "string", enum: SHIPPING_OPTIONS },
    subtotal: money,
    discount: money,
    shipping: money,
    total: money,
    expiresAt: { type: "string" },
  },
  additionalProperties: false,
};

export const initiateCheckoutSchema = {
  type: "object",
  required: ["cartId"],
  properties: {
    cartId: { type: "string", pattern: UUID_PATTERN },
  },
  additionalProperties: false,
};

export const applyCheckoutSchema = {
  type: "object",
  required: ["session"],
  properties: {
    session,
    promoCode: { type: "string", minLength: 1, maxLength: 50 },
    shippingOption: { type: "string", enum: SHIPPING_OPTIONS },
  },
  additionalProperties: false,
};

export const confirmCheckoutSchema = {
  type: "object",
  required: ["session"],
  properties: {
    session,
  },
  additionalProperties: false,
};
