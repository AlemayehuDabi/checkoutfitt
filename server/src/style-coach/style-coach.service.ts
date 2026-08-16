import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { styleTipsKey } from '../cache/cache-keys';
import { LLMService } from '../ai/llm/llm.service';
import { ClosetService } from '../closet/closet.service';
import { ClosetItem } from '../../prisma/generated/prisma';
import {
  MAX_ITEMS_IN_STYLE_PROMPT,
  MAX_TIPS,
  MAX_TRAITS,
  MIN_ITEMS_FOR_STYLE_ANALYSIS,
  STYLE_ARCHETYPES,
  STYLE_TIPS_CACHE_TTL_SECONDS,
  StyleArchetype,
} from './constants';
import {
  buildStyleAnalysisPrompt,
  buildStyleTipsPrompt,
  STYLE_ANALYSIS_JSON_SCHEMA,
  STYLE_COACH_SYSTEM_PROMPT,
  STYLE_TIPS_JSON_SCHEMA,
  StyleAnalysisPayload,
  StyleItemSummary,
  StyleTipsPayload,
} from './style-coach.schema';

export interface StyleAnalysisResult {
  archetype: string | null;
  traits: string[];
  description: string;
  tips: string[];
  itemCount: number;
  /** false when the closet was too small to read a style from. */
  analyzed: boolean;
  analyzedAt: string | null;
}

export interface StyleProfileResult {
  archetype: string;
  traits: string[];
  description: string;
  analyzedAt: string;
}

function toSummary(item: ClosetItem): StyleItemSummary {
  return {
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    color: item.color ?? 'unknown',
    tags: item.tags,
  };
}

/** Prisma returns Json columns as JsonValue; traits are always written as a
 * string[], but a hand-edited row shouldn't be able to break the response. */
function readTraits(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

function cleanStrings(value: unknown, max: number): string[] {
  return (Array.isArray(value) ? value : [])
    .filter(
      (entry): entry is string =>
        typeof entry === 'string' && entry.trim().length > 0,
    )
    .slice(0, max);
}

@Injectable()
export class StyleCoachService {
  private readonly logger = new Logger(StyleCoachService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly llmService: LLMService,
    private readonly closetService: ClosetService,
  ) {}

  async analyze(userId: string): Promise<StyleAnalysisResult> {
    const items = await this.closetService.list(userId, { archived: false });

    if (items.length < MIN_ITEMS_FOR_STYLE_ANALYSIS) {
      return {
        archetype: null,
        traits: [],
        description: `Add at least ${MIN_ITEMS_FOR_STYLE_ANALYSIS} items to your closet before analyzing your style — you currently have ${items.length}.`,
        tips: [],
        itemCount: items.length,
        analyzed: false,
        analyzedAt: null,
      };
    }

    const sample = items.slice(0, MAX_ITEMS_IN_STYLE_PROMPT);
    const payload =
      await this.llmService.generateStructured<StyleAnalysisPayload>({
        prompt: buildStyleAnalysisPrompt(sample.map(toSummary), items.length),
        schema: STYLE_ANALYSIS_JSON_SCHEMA,
        schemaName: 'style_analysis',
        systemPrompt: STYLE_COACH_SYSTEM_PROMPT,
      });

    // Structured output constrains the enum, but a value outside the
    // taxonomy would still be persisted verbatim and confuse clients that
    // map archetype to UI, so it's checked rather than trusted.
    const archetype = STYLE_ARCHETYPES.includes(
      payload.archetype as StyleArchetype,
    )
      ? payload.archetype
      : null;
    if (!archetype) {
      this.logger.warn(
        `Style analysis returned unknown archetype "${payload.archetype}" for user ${userId}`,
      );
    }

    const traits = cleanStrings(payload.traits, MAX_TRAITS);
    const description =
      typeof payload.description === 'string' ? payload.description : '';
    const tips = cleanStrings(payload.tips, MAX_TIPS);
    const analyzedAt = new Date();

    // Overwrites any previous analysis — one archetype per user, no history.
    await this.prisma.profile.update({
      where: { userId },
      data: {
        styleArchetype: archetype,
        styleTraits: traits,
        styleDescription: description,
        styleAnalyzedAt: analyzedAt,
      },
    });

    // A re-analysis makes previously cached tips stale.
    await this.cache.del(styleTipsKey(userId));

    return {
      archetype,
      traits,
      description,
      tips,
      itemCount: items.length,
      analyzed: true,
      analyzedAt: analyzedAt.toISOString(),
    };
  }

  async getProfile(userId: string): Promise<StyleProfileResult> {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile?.styleAnalyzedAt) {
      throw new NotFoundException(
        'Your style has not been analyzed yet. Run POST /style-coach/analyze first.',
      );
    }
    return {
      archetype: profile.styleArchetype ?? '',
      traits: readTraits(profile.styleTraits),
      description: profile.styleDescription ?? '',
      analyzedAt: profile.styleAnalyzedAt.toISOString(),
    };
  }

  /**
   * Lighter than a full re-analysis: reuses the stored archetype instead of
   * re-deriving it, and only asks for tips.
   */
  async tips(userId: string): Promise<{ tips: string[] }> {
    const cacheKey = styleTipsKey(userId);
    const cached = await this.cache.get<{ tips: string[] }>(cacheKey);
    if (cached) {
      return cached;
    }

    const profile = await this.getProfile(userId);
    const items = await this.closetService.list(userId, { archived: false });
    const sample = items.slice(0, MAX_ITEMS_IN_STYLE_PROMPT);

    const payload = await this.llmService.generateStructured<StyleTipsPayload>({
      prompt: buildStyleTipsPrompt(
        profile.archetype,
        profile.traits,
        sample.map(toSummary),
        items.length,
      ),
      schema: STYLE_TIPS_JSON_SCHEMA,
      schemaName: 'style_tips',
      systemPrompt: STYLE_COACH_SYSTEM_PROMPT,
    });

    const result = { tips: cleanStrings(payload.tips, MAX_TIPS) };
    await this.cache.set(cacheKey, result, STYLE_TIPS_CACHE_TTL_SECONDS);
    return result;
  }
}
