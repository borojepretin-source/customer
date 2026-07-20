export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  tag: string = '[Firestore]'
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (e) {
      attempt++;
      if (attempt >= maxAttempts) {
        console.error(`${tag} Failed after ${maxAttempts} attempts:`, e);
        throw e;
      }
      const delayMs = 500 * (1 << attempt); // 1s, 2s, 4s...
      console.log(`${tag} Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timeoutId);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}
