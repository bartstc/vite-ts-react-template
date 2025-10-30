export async function sleep(ms: number): Promise<void>;
export async function sleep<T>(ms: number, returnValue: T): Promise<T>;
export async function sleep<T>(ms: number, returnValue?: T): Promise<T | void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(returnValue), ms);
  });
}
