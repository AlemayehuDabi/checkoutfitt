import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { LLMService } from '../ai/llm/llm.service';
import { ClosetService } from '../closet/closet.service';
import { ClosetItem } from '../../prisma/generated/prisma';
import { CLOSET_ITEM_TYPES } from '../closet/constants';
import { resolveImageSource } from '../common/image-source.util';
import { MatchInspirationDto } from './dto/match-inspiration.dto';
import {
  INSPIRATION_CACHE_TTL_SECONDS,
  MAX_INSPO_PIECES,
  MAX_ITEMS_IN_INSPIRATION_PROMPT,
  MAX_MATCH_REASONS,
} from './constants';
import {
  buildInspirationMatchPrompt,
  INSPO_EXTRACTION_JSON_SCHEMA,
  INSPO_EXTRACTION_PROMPT,
  INSPO_EXTRACTION_SYSTEM_PROMPT,
  INSPO_MATCH_JSON_SCHEMA,
  INSPO_MATCH_SYSTEM_PROMPT,
  InspirationClosetItem,
  InspoExtractionPayload,
  InspoMatchPayload,
  InspoPiece,
} from './inspiration.schema';

export interface MatchedPiece {
  inspoPiece: InspoPiece;
  matchedItem: { closetItemId: string; imageUrl: string; type: string };
  matchScore: number;
}

export interface MissingPiece {
  type: string;
  color: string;
  style: string;
  suggestion: string;
}

export interface InspirationMatchResult {
  vibe: string;
  overallMatchPercentage: number;
  matchedPieces: MatchedPiece[];
  missingPieces: MissingPiece[];
  matchReasons: string[];
  generatedAt: string;
}

function toInspirationItem(item: ClosetItem): InspirationClosetItem {
  return {
    id: item.id,
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    color: item.color ?? 'unknown',
    tags: item.tags,
  };
}

function clampPercentage(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.min(100, Math.max(0, Math.round(number)))
    : 0;
}

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

@Injectable()
export class InspirationService {
  private readonly logger = new Logger(InspirationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly llmService: LLMService,
    private readonly closetService: ClosetService,
  ) {}

  async match(
    userId: string,
    dto: MatchInspirationDto,
  ): Promise<InspirationMatchResult> {
    const imageUrl = await resolveImageSource(
      this.prisma,
      userId,
      { attachmentId: dto.attachmentId, imageUrl: dto.imageUrl },
      'imageUrl',
    );

    const cacheKey = `inspiration:${userId}:${createHash('sha256')
      .update(imageUrl)
      .digest('hex')}`;
    const cached = await this.cache.get<InspirationMatchResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // Step 1: read the individual garments out of the inspiration photo.
    const extraction =
      await this.llmService.generateStructured<InspoExtractionPayload>({
        prompt: INSPO_EXTRACTION_PROMPT,
        schema: INSPO_EXTRACTION_JSON_SCHEMA,
        schemaName: 'inspiration_pieces',
        systemPrompt: INSPO_EXTRACTION_SYSTEM_PROMPT,
        imageUrls: [imageUrl],
      });

    const pieces = this.normalizePieces(extraction.pieces);
    const vibe = cleanText(extraction.vibe);

    // Step 2: match those pieces against the closet.
    const items = await this.closetService.list(userId, { archived: false });
    const sample = items.slice(0, MAX_ITEMS_IN_INSPIRATION_PROMPT);

    const payload = await this.llmService.generateStructured<InspoMatchPayload>(
      {
        prompt: buildInspirationMatchPrompt({
          pieces,
          vibe,
          items: sample.map(toInspirationItem),
          totalItems: items.length,
        }),
        schema: INSPO_MATCH_JSON_SCHEMA,
        schemaName: 'inspiration_match',
        systemPrompt: INSPO_MATCH_SYSTEM_PROMPT,
        maxTokens: 3072,
      },
    );

    const result: InspirationMatchResult = {
      vibe,
      ...this.normalizeMatch(payload, pieces, items),
      generatedAt: new Date().toISOString(),
    };

    await this.cache.set(cacheKey, result, INSPIRATION_CACHE_TTL_SECONDS);
    return result;
  }

  private normalizePieces(value: unknown): InspoPiece[] {
    const raw = Array.isArray(value) ? value : [];
    return raw
      .filter(
        (piece): piece is InspoPiece =>
          Boolean(piece) && typeof piece === 'object',
      )
      .map((piece) => ({
        type: (CLOSET_ITEM_TYPES as readonly string[]).includes(
          String(piece.type).toLowerCase(),
        )
          ? String(piece.type).toLowerCase()
          : 'other',
        color: cleanText(piece.color) || 'unknown',
        style: cleanText(piece.style),
      }))
      .slice(0, MAX_INSPO_PIECES);
  }

  private normalizeMatch(
    payload: InspoMatchPayload,
    pieces: InspoPiece[],
    items: ClosetItem[],
  ): Omit<InspirationMatchResult, 'vibe' | 'generatedAt'> {
    const byId = new Map(items.map((item) => [item.id, item]));
    const usedPieceIndexes = new Set<number>();

    // Same hallucination guard as outfit generation, plus a bounds check on
    // the piece index — a match pointing at a piece that was never extracted
    // can't be rendered.
    const matchedPieces: MatchedPiece[] = [];
    for (const entry of Array.isArray(payload.matchedPieces)
      ? payload.matchedPieces
      : []) {
      const index = Number(entry?.inspoPieceIndex);
      const item = byId.get(entry?.closetItemId);
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= pieces.length ||
        !item ||
        usedPieceIndexes.has(index)
      ) {
        continue;
      }
      usedPieceIndexes.add(index);
      matchedPieces.push({
        inspoPiece: pieces[index],
        matchedItem: {
          closetItemId: item.id,
          imageUrl: item.imageUrl,
          type: (item.type ?? 'other').toLowerCase(),
        },
        matchScore: clampPercentage(entry.matchScore),
      });
    }

    if (matchedPieces.length === 0 && pieces.length > 0) {
      this.logger.warn(
        'Inspiration matching produced no usable matches for the extracted pieces',
      );
    }

    const missingPieces: MissingPiece[] = (
      Array.isArray(payload.missingPieces) ? payload.missingPieces : []
    )
      .filter((piece) => Boolean(piece))
      .map((piece) => ({
        type: (CLOSET_ITEM_TYPES as readonly string[]).includes(
          String(piece.type).toLowerCase(),
        )
          ? String(piece.type).toLowerCase()
          : 'other',
        color: cleanText(piece.color),
        style: cleanText(piece.style),
        suggestion: cleanText(piece.suggestion),
      }))
      .slice(0, MAX_INSPO_PIECES);

    return {
      overallMatchPercentage: clampPercentage(payload.overallMatchPercentage),
      matchedPieces,
      missingPieces,
      matchReasons: (Array.isArray(payload.matchReasons)
        ? payload.matchReasons
        : []
      )
        .filter(
          (reason): reason is string =>
            typeof reason === 'string' && reason.trim().length > 0,
        )
        .map((reason) => reason.trim())
        .slice(0, MAX_MATCH_REASONS),
    };
  }
}
