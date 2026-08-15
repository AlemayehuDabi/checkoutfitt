import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { gapAnalysisKey } from '../cache/cache-keys';
import { LLMService } from '../ai/llm/llm.service';
import { ClosetService } from '../closet/closet.service';
import { ClosetItem } from '../../prisma/generated/prisma';
import {
  GAP_ANALYSIS_CACHE_TTL_SECONDS,
  MAX_MISSING_ITEMS,
  MIN_ITEMS_FOR_GAP_ANALYSIS,
} from './constants';
import {
  buildGapAnalysisPrompt,
  GAP_ANALYSIS_JSON_SCHEMA,
  GAP_ANALYSIS_SYSTEM_PROMPT,
  GapAnalysisPayload,
  InventorySummary,
  MissingItem,
} from './gap-analysis.schema';

export interface GapAnalysisResult extends GapAnalysisPayload {
  itemCount: number;
  /** false when the closet was too small to be worth an LLM call. */
  analyzed: boolean;
  generatedAt: string;
}

function buildInventory(items: ClosetItem[]): InventorySummary {
  const byType: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byColor: Record<string, number> = {};

  for (const item of items) {
    const type = (item.type ?? 'other').toLowerCase();
    byType[type] = (byType[type] ?? 0) + 1;
    if (item.category) {
      byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
    }
    if (item.color) {
      byColor[item.color] = (byColor[item.color] ?? 0) + 1;
    }
  }

  return { totalItems: items.length, byType, byCategory, byColor };
}

@Injectable()
export class GapAnalysisService {
  private readonly logger = new Logger(GapAnalysisService.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly cache: CacheService,
    private readonly closetService: ClosetService,
  ) {}

  async analyze(userId: string): Promise<GapAnalysisResult> {
    const cacheKey = gapAnalysisKey(userId);
    const cached = await this.cache.get<GapAnalysisResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const items = await this.closetService.list(userId, { archived: false });

    if (items.length < MIN_ITEMS_FOR_GAP_ANALYSIS) {
      // Not cached: it's cheap to recompute, and caching it would risk
      // serving "add more items" back to a user who just added some.
      return {
        completionPercentage: 0,
        missingItems: [],
        summary: `Add at least ${MIN_ITEMS_FOR_GAP_ANALYSIS} items to your closet to get a wardrobe gap analysis — you currently have ${items.length}.`,
        itemCount: items.length,
        analyzed: false,
        generatedAt: new Date().toISOString(),
      };
    }

    const payload =
      await this.llmService.generateStructured<GapAnalysisPayload>({
        prompt: buildGapAnalysisPrompt(buildInventory(items)),
        schema: GAP_ANALYSIS_JSON_SCHEMA,
        schemaName: 'wardrobe_gap_analysis',
        systemPrompt: GAP_ANALYSIS_SYSTEM_PROMPT,
      });

    const result: GapAnalysisResult = {
      ...this.normalize(payload),
      itemCount: items.length,
      analyzed: true,
      generatedAt: new Date().toISOString(),
    };

    await this.cache.set(cacheKey, result, GAP_ANALYSIS_CACHE_TTL_SECONDS);
    return result;
  }

  /**
   * Structured output guarantees the JSON *shape*, not that the values are
   * sane — the same reason outfit generation re-checks returned item IDs.
   * A percentage outside 0-100 or a malformed entry would otherwise reach
   * the client as-is.
   */
  private normalize(payload: GapAnalysisPayload): GapAnalysisPayload {
    const rawItems = Array.isArray(payload.missingItems)
      ? payload.missingItems
      : [];

    const missingItems: MissingItem[] = rawItems
      .filter((item) => item && typeof item.name === 'string' && item.name)
      .slice(0, MAX_MISSING_ITEMS)
      .map((item) => ({
        name: item.name,
        type: typeof item.type === 'string' ? item.type.toLowerCase() : 'other',
        category: typeof item.category === 'string' ? item.category : '',
        reason: typeof item.reason === 'string' ? item.reason : '',
        estimatedNewOutfits: Math.max(
          0,
          Math.round(Number(item.estimatedNewOutfits) || 0),
        ),
      }));

    if (rawItems.length !== missingItems.length) {
      this.logger.warn(
        `Dropped ${rawItems.length - missingItems.length} malformed gap-analysis item(s)`,
      );
    }

    const percentage = Number(payload.completionPercentage);
    return {
      completionPercentage: Number.isFinite(percentage)
        ? Math.min(100, Math.max(0, Math.round(percentage)))
        : 0,
      missingItems,
      summary: typeof payload.summary === 'string' ? payload.summary : '',
    };
  }
}
