/** Splits a list into fixed-size chunks, preserving order. */
export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Runs `worker` over `items` with at most `limit` in flight.
 *
 * Firing every batch at once is what rate limits and "model overloaded"
 * responses are made of, and running them one at a time makes a large closet
 * take minutes. Results come back in input order regardless of completion
 * order.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array<PromiseSettledResult<R>>(
    items.length,
  );
  let cursor = 0;

  const runners = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        try {
          results[index] = {
            status: 'fulfilled',
            value: await worker(items[index], index),
          };
        } catch (reason: unknown) {
          results[index] = { status: 'rejected', reason };
        }
      }
    },
  );

  await Promise.all(runners);
  return results;
}
