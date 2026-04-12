const CATEGORIES = ["clothing", "jewelery", "electronics"];
const CURRENCIES = ["USD", "EUR", "GBP"];

export const createProductSchema = {
  type: "object",
  required: ["name", "description", "price", "imageUrl", "category"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", minLength: 1, maxLength: 2000 },
    price: {
      type: "object",
      required: ["amount", "code"],
      properties: {
        amount: { type: "number", exclusiveMinimum: 0 },
        code: { type: "string", enum: CURRENCIES },
      },
      additionalProperties: false,
    },
    imageUrl: { type: "string", format: "uri" },
    category: { type: "string", enum: CATEGORIES },
  },
  additionalProperties: false,
};

export const updateProductSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", minLength: 1, maxLength: 2000 },
    imageUrl: { type: "string", format: "uri" },
  },
  additionalProperties: false,
};

export const updatePriceSchema = {
  type: "object",
  required: ["amount", "code"],
  properties: {
    amount: { type: "number", exclusiveMinimum: 0 },
    code: { type: "string", enum: CURRENCIES },
  },
  additionalProperties: false,
};

export const listProductsQuerySchema = {
  type: "object",
  properties: {
    limit: { type: "integer", default: 10, minimum: 1 },
    sort: { type: "string", enum: ["asc", "desc"], default: "asc" },
  },
};
