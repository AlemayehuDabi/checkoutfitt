import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { closetValueKey } from '../cache/cache-keys';
import { LLMService } from '../ai/llm/llm.service';
import { ClosetService } from '../closet/closet.service';
import { ClosetItem } from '../../prisma/generated/prisma';
import { chunk, mapWithConcurrency } from '../common/concurrency.util';
import {
  CLOSET_VALUE_BATCH_CONCURRENCY,
  CLOSET_VALUE_BATCH_SIZE,
  CLOSET_VALUE_CACHE_TTL_SECONDS,
  TOP_VALUED_ITEMS,
} from './constants';
import {
  buildClosetValuePrompt,
  CLOSET_VALUE_JSON_SCHEMA,
  CLOSET_VALUE_SYSTEM_PROMPT,
  ClosetValueBatchPayload,
  CONFIDENCE_LEVELS,
  ConfidenceLevel,
  VALUATION_CURRENCY,
  ValuationCandidate,
} from './closet-value.schema';

export interface CategoryBreakdown {
  name: string;
  itemCount: number;
  totalValue: number;
}

export interface TopValuedItem {
  closetItemId: string;
  name: string;
  type: string;
  category: string;
  estimatedValue: number;
  imageUrl: string;
}

export interface ClosetValueResult {
  totalValue: number;
  currency: string;
  totalItems: number;
  /** How many of `totalItems` the model actually returned a value for. */
  valuedItems: number;
  categoryCount: number;
  categories: CategoryBreakdown[];
  topItems: TopValuedItem[];
  generatedAt: string;
}

interface ValuedItem {
  item: ClosetItem;
  estimatedValue: number;
  confidence: ConfidenceLevel;
  brandGuess: string;
}

function toCandidate(item: ClosetItem): ValuationCandidate {
  return {
    id: item.id,
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    color: item.color ?? 'unknown',
    tags: item.tags,
  };
}

/** Money to cents, so summing many estimates can't drift. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function displayName(item: ClosetItem, brandGuess: string): string {
  const label = item.category ?? (item.type ?? 'item').toLowerCase();
  const branded = brandGuess && brandGuess.toLowerCase() !== 'unknown';
  return branded ? `${brandGuess} ${label}` : label;
}

@Injectable()
export class ClosetValueService {
  private readonly logger = new Logger(ClosetValueService.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly cache: CacheService,
    private readonly closetService: ClosetService,
  ) {}

  async calculate(userId: string): Promise<ClosetValueResult> {
    const cacheKey = closetValueKey(userId);
    const cached = await this.cache.get<ClosetValueResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const items = await this.closetService.list(userId, { archived: false });
    if (items.length === 0) {
      // Nothing to appraise — don't spend a call to be told zero.
      return this.emptyResult();
    }

    const valued = await this.valueInBatches(items);
    const result = this.aggregate(items, valued);

    await this.cache.set(cacheKey, result, CLOSET_VALUE_CACHE_TTL_SECONDS);
    return result;
  }

  /**
   * Values the closet in bounded-concurrency batches. A batch that fails is
   * logged and skipped rather than failing the whole request — a partial
   * valuation with an honest `valuedItems` count is more useful than an
   * error. Only a total wipeout is reported as an outage.
   */
  private async valueInBatches(items: ClosetItem[]): Promise<ValuedItem[]> {
    const byId = new Map(items.map((item) => [item.id, item]));
    const batches = chunk(items, CLOSET_VALUE_BATCH_SIZE);

    const settled = await mapWithConcurrency(
      batches,
      CLOSET_VALUE_BATCH_CONCURRENCY,
      (batch) =>
        this.llmService.generateStructured<ClosetValueBatchPayload>({
          prompt: buildClosetValuePrompt(batch.map(toCandidate)),
          schema: CLOSET_VALUE_JSON_SCHEMA,
          schemaName: 'closet_valuation',
          systemPrompt: CLOSET_VALUE_SYSTEM_PROMPT,
          imageUrls: batch.map((item) => item.imageUrl),
          maxTokens: 4096,
        }),
    );

    const failures = settled.filter((r) => r.status === 'rejected').length;
    if (failures === batches.length) {
      throw new ServiceUnavailableException(
        'The AI provider is currently unavailable. Please try again shortly.',
      );
    }
    if (failures > 0) {
      this.logger.warn(
        `${failures}/${batches.length} valuation batches failed; returning a partial valuation`,
      );
    }

    // Structured output guarantees shape, not that IDs are real — same guard
    // as outfit generation. Unknown or duplicated IDs are dropped.
    const seen = new Set<string>();
    const valued: ValuedItem[] = [];

    for (const outcome of settled) {
      if (outcome.status !== 'fulfilled') {
        continue;
      }
      for (const entry of outcome.value?.items ?? []) {
        const item = byId.get(entry?.closetItemId);
        if (!item || seen.has(item.id)) {
          continue;
        }
        const value = Number(entry.estimatedValue);
        if (!Number.isFinite(value) || value < 0) {
          continue;
        }
        seen.add(item.id);
        valued.push({
          item,
          estimatedValue: round2(value),
          confidence: CONFIDENCE_LEVELS.includes(
            entry.confidence as ConfidenceLevel,
          )
            ? (entry.confidence as ConfidenceLevel)
            : 'low',
          brandGuess:
            typeof entry.brandGuess === 'string' ? entry.brandGuess : 'unknown',
        });
      }
    }

    return valued;
  }

  private aggregate(
    allItems: ClosetItem[],
    valued: ValuedItem[],
  ): ClosetValueResult {
    const categories = new Map<string, CategoryBreakdown>();

    for (const { item, estimatedValue } of valued) {
      const name = item.category ?? (item.type ?? 'other').toLowerCase();
      const bucket = categories.get(name) ?? {
        name,
        itemCount: 0,
        totalValue: 0,
      };
      bucket.itemCount += 1;
      bucket.totalValue = round2(bucket.totalValue + estimatedValue);
      categories.set(name, bucket);
    }

    const topItems = [...valued]
      .sort((a, b) => b.estimatedValue - a.estimatedValue)
      .slice(0, TOP_VALUED_ITEMS)
      .map(({ item, estimatedValue, brandGuess }) => ({
        closetItemId: item.id,
        name: displayName(item, brandGuess),
        type: (item.type ?? 'other').toLowerCase(),
        category: item.category ?? 'unknown',
        estimatedValue,
        imageUrl: item.imageUrl,
      }));

    return {
      totalValue: round2(
        valued.reduce((sum, entry) => sum + entry.estimatedValue, 0),
      ),
      currency: VALUATION_CURRENCY,
      totalItems: allItems.length,
      valuedItems: valued.length,
      categoryCount: categories.size,
      categories: [...categories.values()].sort(
        (a, b) => b.totalValue - a.totalValue,
      ),
      topItems,
      generatedAt: new Date().toISOString(),
    };
  }

  private emptyResult(): ClosetValueResult {
    return {
      totalValue: 0,
      currency: VALUATION_CURRENCY,
      totalItems: 0,
      valuedItems: 0,
      categoryCount: 0,
      categories: [],
      topItems: [],
      generatedAt: new Date().toISOString(),
    };
  }
}
