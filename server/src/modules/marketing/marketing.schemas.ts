export const createMarketingProductSchema = {
  type: "object",
  required: ["productId"],
  properties: {
    productId: {
      type: "string",
      pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    },
  },
  additionalProperties: false,
};

export const rateProductSchema = {
  type: "object",
  required: ["rating"],
  properties: {
    rating: { type: "integer", minimum: 1, maximum: 5 },
  },
  additionalProperties: false,
};
