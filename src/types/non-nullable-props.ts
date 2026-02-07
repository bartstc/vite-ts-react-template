export type NonNullableProps<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
