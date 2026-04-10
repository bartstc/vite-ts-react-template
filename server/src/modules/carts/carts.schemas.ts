export const addToCartSchema = {
  type: "object",
  required: ["productId", "quantity"],
  properties: {
    productId: {
      type: "string",
      pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    },
    quantity: { type: "integer", minimum: 1 },
  },
  additionalProperties: false,
} as const;
