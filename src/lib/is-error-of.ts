// AIDEV-NOTE: builds a predicate testing whether an object's `error` is an instance of a
// given Error subclass. The param accepts any object (e.g. an XState event union where some
// members lack `error`), so we narrow with `"error" in obj` before the instanceof check.
export const isErrorOf =
  <TError extends Error>(ErrorClass: new (...args: never[]) => TError) =>
  ({ event }: { event: object }): boolean =>
    "error" in event && event.error instanceof ErrorClass;
