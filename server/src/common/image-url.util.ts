import { BadRequestException } from '@nestjs/common';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

/**
 * Guards the one place the API fetches a URL supplied by the caller.
 *
 * Without this, `productImageUrl` is a server-side request forgery vector:
 * the server (or the Gemini provider, which inlines images by fetching them)
 * would happily retrieve http://localhost:6379, a cloud metadata endpoint,
 * or anything else reachable from inside the network and surface the result.
 *
 * Note the residual race: the vendor fetches the URL again later, so a host
 * that re-resolves to a private address between this check and that fetch
 * would slip through. Closing that properly needs a fetch through a pinned-IP
 * agent or an egress proxy; this covers the realistic cases.
 */

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata',
]);

const MAX_REMOTE_IMAGE_BYTES = 15 * 1024 * 1024;
const PROBE_TIMEOUT_MS = 8000;
/** One retry: a transient network blip shouldn't reject a perfectly good URL. */
const PROBE_ATTEMPTS = 2;

function isPrivateAddress(address: string): boolean {
  const version = isIP(address);

  if (version === 4) {
    const [a, b] = address.split('.').map(Number);
    return (
      a === 0 || // "this" network
      a === 10 || // private
      a === 127 || // loopback
      (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
      (a === 169 && b === 254) || // link-local, incl. cloud metadata
      (a === 172 && b >= 16 && b <= 31) || // private
      (a === 192 && b === 168) || // private
      a >= 224 // multicast + reserved
    );
  }

  const lower = address.toLowerCase();
  return (
    lower === '::' ||
    lower === '::1' || // loopback
    lower.startsWith('fc') || // unique local
    lower.startsWith('fd') ||
    lower.startsWith('fe80') || // link-local
    lower.startsWith('::ffff:') // IPv4-mapped, would bypass the v4 checks
  );
}

async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith('.localhost')) {
    throw new BadRequestException(
      'productImageUrl must point at a publicly reachable host',
    );
  }

  const addresses = isIP(host)
    ? [{ address: host }]
    : await lookup(host, { all: true }).catch(() => {
        throw new BadRequestException(
          `productImageUrl host "${host}" could not be resolved`,
        );
      });

  if (addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new BadRequestException(
      'productImageUrl must point at a publicly reachable host',
    );
  }
}

/**
 * Validates that the URL is a public http(s) address actually serving an
 * image, following redirects and re-checking the host it lands on. Returns
 * the final resolved URL so callers use the validated target rather than the
 * original.
 */
export async function assertPublicImageUrl(raw: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new BadRequestException('productImageUrl is not a valid URL');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BadRequestException('productImageUrl must be an http(s) URL');
  }
  await assertPublicHost(url.hostname);

  const controller = new AbortController();
  const timeout = AbortSignal.timeout(PROBE_TIMEOUT_MS);
  let response: Response | undefined;

  for (let attempt = 0; attempt < PROBE_ATTEMPTS; attempt++) {
    try {
      response = await fetch(url, {
        signal: AbortSignal.any([controller.signal, timeout]),
        redirect: 'follow',
      });
      break;
    } catch {
      if (attempt === PROBE_ATTEMPTS - 1) {
        throw new BadRequestException(
          'productImageUrl could not be fetched — check that the link is publicly reachable',
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  if (!response) {
    throw new BadRequestException('productImageUrl could not be fetched');
  }

  try {
    if (!response.ok) {
      throw new BadRequestException(
        `productImageUrl returned HTTP ${response.status}`,
      );
    }

    // A redirect can land somewhere private even when the first host was fine.
    const finalUrl = new URL(response.url || url.toString());
    if (finalUrl.host !== url.host) {
      await assertPublicHost(finalUrl.hostname);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      throw new BadRequestException(
        `productImageUrl does not point at an image (content-type: ${contentType || 'unknown'})`,
      );
    }

    const declaredLength = Number(response.headers.get('content-length'));
    if (
      Number.isFinite(declaredLength) &&
      declaredLength > MAX_REMOTE_IMAGE_BYTES
    ) {
      throw new BadRequestException('productImageUrl image is too large');
    }

    return finalUrl.toString();
  } finally {
    // Headers are all this needs; don't pull the body down.
    controller.abort();
  }
}
