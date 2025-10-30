export function assertValue<T>(
  value: T,
  error?: Error
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw error ?? new Error("Value must not be null or undefined");
  }
}
