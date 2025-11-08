// AIDEV-NOTE: Utility type to extract a specific variant from a discriminated union by its type field
export type OneOfUnion<T, K> = T extends { type: K } ? T : never;
