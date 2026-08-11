/**
 * Gemini's `inlineData` part needs raw bytes — unlike Anthropic/OpenAI, which
 * accept a hosted image URL directly, so only the Gemini provider needs this.
 */
export async function fetchImageAsBase64(
  url: string,
): Promise<{ data: string; mimeType: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image at ${url}: ${response.status}`);
  }
  const mimeType = response.headers.get('content-type') ?? 'image/jpeg';
  const buffer = Buffer.from(await response.arrayBuffer());
  return { data: buffer.toString('base64'), mimeType };
}
