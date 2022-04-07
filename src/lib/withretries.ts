const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

export const withRetries = <T>(delayMs: number, maxAttempts: number, work: () => Promise<T>) => {
  const attempt = (n: number): Promise<T> =>
    work().catch(e => {
      if (n < maxAttempts) {
        return delay(delayMs * 2 ** n).then(() => attempt(n + 1));
      }

      return Promise.reject(e);
    });

  return attempt(1);
};
