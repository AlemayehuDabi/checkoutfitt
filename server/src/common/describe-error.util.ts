/**
 * Renders an unknown thrown value as something worth reading in a log.
 *
 * Not everything rejects with an Error: the Cloudinary SDK rejects with a
 * plain `{ message, http_code }` object, which `String(error)` turns into
 * "[object Object]", and some driver errors carry an empty `message`. Both
 * produce log lines that say nothing at the moment you need them most.
 */
export function describeError(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string | number }).code;
    const suffix = code !== undefined ? ` (${code})` : '';
    return `${error.name}${suffix}: ${error.message || '<no message>'}`;
  }

  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      message?: unknown;
      error?: { message?: unknown };
      http_code?: unknown;
    };
    const message =
      (typeof candidate.message === 'string' && candidate.message) ||
      (typeof candidate.error?.message === 'string' &&
        candidate.error.message) ||
      undefined;
    if (message) {
      const status = candidate.http_code;
      return typeof status === 'number' || typeof status === 'string'
        ? `${message} (HTTP ${status})`
        : message;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return '[unserializable error]';
    }
  }

  return String(error);
}
