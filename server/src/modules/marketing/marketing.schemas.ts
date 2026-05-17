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

export const createReviewSchema = {
  type: "object",
  required: ["rating"],
  properties: {
    rating: { type: "integer", minimum: 1, maximum: 5 },
    title: { type: "string", minLength: 1, maxLength: 200 },
    comment: { type: "string", minLength: 1, maxLength: 2000 },
  },
  additionalProperties: false,
};

export const updateReviewSchema = {
  type: "object",
  properties: {
    rating: { type: "integer", minimum: 1, maximum: 5 },
    title: { type: "string", minLength: 1, maxLength: 200 },
    comment: { type: "string", minLength: 1, maxLength: 2000 },
  },
  additionalProperties: false,
};

export const listReviewsQuerySchema = {
  type: "object",
  properties: {
    limit: { type: "integer", default: 10, minimum: 1 },
    sort: { type: "string", enum: ["asc", "desc"], default: "desc" },
  },
};
