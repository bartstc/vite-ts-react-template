export type AllOrNothing<T extends AnyObject> = T | ToUndefinedObject<T>;

type ToUndefinedObject<T extends AnyObject> = Partial<
  Record<keyof T, undefined>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;
