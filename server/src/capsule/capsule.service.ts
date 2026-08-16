import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { CacheService } from '../cache/cache.service';
import { LLMService } from '../ai/llm/llm.service';
import { ClosetService } from '../closet/closet.service';
import { ClosetItem } from '../../prisma/generated/prisma';
import { GenerateCapsuleDto } from './dto/generate-capsule.dto';
import {
  CAPSULE_CACHE_TTL_SECONDS,
  DEFAULT_CAPSULE_SIZE,
  MAX_ITEMS_IN_CAPSULE_PROMPT,
  MAX_SAMPLE_OUTFITS,
  MIN_CAPSULE_SIZE,
} from './constants';
import {
  buildCapsulePrompt,
  CAPSULE_JSON_SCHEMA,
  CAPSULE_SYSTEM_PROMPT,
  CapsuleCandidate,
  CapsulePayload,
} from './capsule.schema';

export interface CapsuleItem {
  closetItemId: string;
  type: string;
  category: string;
  imageUrl: string;
}

export interface CapsuleResult {
  title: string;
  items: CapsuleItem[];
  totalOutfits: number;
  sampleOutfits: { name: string; items: CapsuleItem[] }[];
  /** What was actually requested, after clamping to closet size. */
  requestedSize: number;
  occasions: string[];
  season: string | null;
  generatedAt: string;
}

function toCandidate(item: ClosetItem): CapsuleCandidate {
  return {
    id: item.id,
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    color: item.color ?? 'unknown',
    tags: item.tags,
  };
}

function toCapsuleItem(item: ClosetItem): CapsuleItem {
  return {
    closetItemId: item.id,
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    imageUrl: item.imageUrl,
  };
}

@Injectable()
export class CapsuleService {
  private readonly logger = new Logger(CapsuleService.name);

  constructor(
    private readonly cache: CacheService,
    private readonly llmService: LLMService,
    private readonly closetService: ClosetService,
  ) {}

  async generate(
    userId: string,
    dto: GenerateCapsuleDto,
  ): Promise<CapsuleResult> {
    const occasions = dto.occasions?.length ? dto.occasions : ['casual'];
    const requested = dto.maxItems ?? DEFAULT_CAPSULE_SIZE;

    // Only detected items are usable: curating needs type/category/colour,
    // which PENDING/PROCESSING/FAILED items don't have yet. Same rule the
    // outfit generator applies.
    const all = await this.closetService.list(userId, { archived: false });
    const items = all.filter((item) => item.status === 'DONE');

    if (items.length < MIN_CAPSULE_SIZE) {
      throw new BadRequestException(
        `A capsule needs at least ${MIN_CAPSULE_SIZE} closet items with completed detection — you have ${items.length}.`,
      );
    }

    // Asking for a capsule bigger than the closet is unsatisfiable, so the
    // target is clamped and reported back rather than silently under-filled.
    const targetSize = Math.min(requested, items.length);

    const cacheKey = this.cacheKey(userId, targetSize, occasions, dto.season);
    const cached = await this.cache.get<CapsuleResult>(cacheKey);
    if (cached) {
      return cached;
    }

    const sample = items.slice(0, MAX_ITEMS_IN_CAPSULE_PROMPT);
    const payload = await this.llmService.generateStructured<CapsulePayload>({
      prompt: buildCapsulePrompt({
        items: sample.map(toCandidate),
        totalItems: items.length,
        targetSize,
        occasions,
        season: dto.season,
      }),
      schema: CAPSULE_JSON_SCHEMA,
      schemaName: 'capsule_wardrobe',
      systemPrompt: CAPSULE_SYSTEM_PROMPT,
      maxTokens: 3072,
    });

    const result: CapsuleResult = {
      ...this.normalize(payload, items, targetSize, dto.season),
      requestedSize: targetSize,
      occasions,
      season: dto.season ?? null,
      generatedAt: new Date().toISOString(),
    };

    await this.cache.set(cacheKey, result, CAPSULE_CACHE_TTL_SECONDS);
    return result;
  }

  /** Params are folded into the key so different constraints don't collide;
   * occasions are sorted so ["office","gym"] and ["gym","office"] share one. */
  private cacheKey(
    userId: string,
    targetSize: number,
    occasions: string[],
    season?: string,
  ): string {
    const fingerprint = JSON.stringify({
      targetSize,
      occasions: [...occasions].sort(),
      season: season ?? null,
    });
    return `capsule:${userId}:${createHash('sha256').update(fingerprint).digest('hex')}`;
  }

  private normalize(
    payload: CapsulePayload,
    items: ClosetItem[],
    targetSize: number,
    season?: string,
  ): Omit<
    CapsuleResult,
    'requestedSize' | 'occasions' | 'season' | 'generatedAt'
  > {
    const byId = new Map(items.map((item) => [item.id, item]));

    // Same hallucination guard as outfit generation: only IDs that exist in
    // this user's closet survive, and duplicates are collapsed.
    const capsuleItems: ClosetItem[] = [];
    const capsuleIds = new Set<string>();
    for (const id of Array.isArray(payload.itemIds) ? payload.itemIds : []) {
      const item = byId.get(id);
      if (item && !capsuleIds.has(id)) {
        capsuleIds.add(id);
        capsuleItems.push(item);
      }
    }
    const selected = capsuleItems.slice(0, targetSize);
    const selectedIds = new Set(selected.map((item) => item.id));

    if (selected.length < targetSize) {
      this.logger.warn(
        `Capsule returned ${selected.length} usable items for a target of ${targetSize}`,
      );
    }

    // A sample outfit is only meaningful if it's built from the capsule, so
    // anything outside the selected set is dropped.
    const sampleOutfits = (
      Array.isArray(payload.sampleOutfits) ? payload.sampleOutfits : []
    )
      .map((outfit) => ({
        name: typeof outfit?.name === 'string' ? outfit.name : 'Sample outfit',
        items: (Array.isArray(outfit?.itemIds) ? outfit.itemIds : [])
          .filter((id) => selectedIds.has(id))
          .map((id) => toCapsuleItem(byId.get(id) as ClosetItem)),
      }))
      .filter((outfit) => outfit.items.length > 0)
      .slice(0, MAX_SAMPLE_OUTFITS);

    const totalOutfits = Number(payload.totalOutfits);
    const seasonLabel = season
      ? `${season.charAt(0).toUpperCase()}${season.slice(1)}`
      : null;

    return {
      title:
        typeof payload.title === 'string' && payload.title.trim()
          ? payload.title.trim()
          : `Your ${seasonLabel ?? 'Everyday'} Capsule`,
      items: selected.map(toCapsuleItem),
      totalOutfits: Number.isFinite(totalOutfits)
        ? Math.max(0, Math.round(totalOutfits))
        : 0,
      sampleOutfits,
    };
  }
}
