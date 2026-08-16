import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Minimal JSON get/set-with-TTL cache backed by Redis (rather than an
 * in-process Map) so cached values survive restarts and are shared across
 * multiple server instances — both weather lookups and daily outfit
 * suggestions need that.
 */
@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(config: ConfigService) {
    this.client = new Redis(config.get<string>('redis.url') as string);
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  /**
   * Drops cached entries. Variadic because the derived closet analyses
   * (gap analysis, valuation, ...) all go stale on the same closet edit and
   * are cleared together. Missing keys are a no-op.
   */
  async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }
    await this.client.del(...keys);
  }

  /**
   * Deletes every key matching a glob, for caches whose key embeds request
   * parameters (capsule constraints, evaluated product hash) and so can't be
   * named exactly at invalidation time.
   *
   * Uses SCAN rather than KEYS so it never blocks Redis on a large keyspace.
   * Patterns are always user-scoped by their caller, which keeps each sweep
   * small.
   */
  async delByPattern(pattern: string): Promise<void> {
    let cursor = '0';
    do {
      const [next, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = next;
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } while (cursor !== '0');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
