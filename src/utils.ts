export const delay =
  <T>(ms: number) =>
  (t: T): Promise<T> =>
    new Promise((res) => setTimeout(res, ms, t));
