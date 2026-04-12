export const marketingQueryKeys = {
  all: ["marketing"] as const,
  products: () => [...marketingQueryKeys.all, "products"] as const,
  product: (productId: string) =>
    [...marketingQueryKeys.products(), productId] as const,
};
