import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLMService } from '../ai/llm/llm.service';
import { getOccasionGuidance } from '../outfit/occasion-guidance';
import { CreateOutfitRatingDto } from './dto/create-outfit-rating.dto';
import { ListOutfitRatingsQueryDto } from './dto/list-outfit-ratings-query.dto';
import {
  DEFAULT_RATING_PAGE_SIZE,
  MAX_SCORE,
  MAX_SUGGESTIONS,
  MIN_SCORE,
} from './constants';
import {
  buildOutfitRatingPrompt,
  OUTFIT_RATING_JSON_SCHEMA,
  OUTFIT_RATING_SYSTEM_PROMPT,
  OutfitRatingPayload,
} from './outfit-rating.schema';

const RATING_INCLUDE = { imageAttachment: true };

/** Scores are 0-10 with one decimal; the model occasionally returns 8.66667
 * or an out-of-range value, neither of which should reach the client. */
function normalizeScore(value: unknown): number {
  const score = Number(value);
  if (!Number.isFinite(score)) {
    return MIN_SCORE;
  }
  return Math.round(Math.min(MAX_SCORE, Math.max(MIN_SCORE, score)) * 10) / 10;
}

@Injectable()
export class OutfitRatingService {
  private readonly logger = new Logger(OutfitRatingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LLMService,
  ) {}

  async create(userId: string, dto: CreateOutfitRatingDto) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: dto.attachmentId },
    });
    if (!attachment || attachment.ownerId !== userId) {
      throw new NotFoundException('Attachment not found');
    }

    const payload =
      await this.llmService.generateStructured<OutfitRatingPayload>({
        prompt: buildOutfitRatingPrompt(
          dto.occasion,
          dto.occasion ? getOccasionGuidance(dto.occasion) : undefined,
        ),
        schema: OUTFIT_RATING_JSON_SCHEMA,
        schemaName: 'outfit_rating',
        systemPrompt: OUTFIT_RATING_SYSTEM_PROMPT,
        imageUrls: [attachment.secureUrl],
      });

    const colorHarmonyScore = normalizeScore(payload.colorHarmonyScore);
    const fitScore = normalizeScore(payload.fitScore);
    const occasionMatchScore = normalizeScore(payload.occasionMatchScore);

    const suggestions = (
      Array.isArray(payload.suggestions) ? payload.suggestions : []
    )
      .filter(
        (suggestion): suggestion is string =>
          typeof suggestion === 'string' && suggestion.trim().length > 0,
      )
      .slice(0, MAX_SUGGESTIONS);

    if (suggestions.length === 0) {
      this.logger.warn(
        `Outfit rating for attachment ${attachment.id} returned no usable suggestions`,
      );
    }

    return this.prisma.outfitRating.create({
      data: {
        ownerId: userId,
        imageAttachmentId: attachment.id,
        colorHarmonyScore,
        fitScore,
        occasionMatchScore,
        // Averaged here rather than asked of the model, so the total can
        // never contradict the three parts it summarizes.
        overallScore:
          Math.round(
            ((colorHarmonyScore + fitScore + occasionMatchScore) / 3) * 10,
          ) / 10,
        occasion: dto.occasion,
        suggestions,
      },
      include: RATING_INCLUDE,
    });
  }

  async list(userId: string, query: ListOutfitRatingsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_RATING_PAGE_SIZE;
    const where = { ownerId: userId };

    const [items, total] = await Promise.all([
      this.prisma.outfitRating.findMany({
        where,
        include: RATING_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.outfitRating.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(userId: string, id: string) {
    const rating = await this.prisma.outfitRating.findUnique({
      where: { id },
      include: RATING_INCLUDE,
    });
    if (!rating || rating.ownerId !== userId) {
      throw new NotFoundException('Outfit rating not found');
    }
    return rating;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.outfitRating.delete({ where: { id } });
  }
}
