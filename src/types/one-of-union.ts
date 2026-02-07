export type OneOfUnion<
  TUnion extends { type: string },
  TType extends TUnion["type"],
> = Extract<TUnion, { type: TType }>;
