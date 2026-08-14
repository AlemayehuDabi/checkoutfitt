import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { LLMService } from '../ai/llm/llm.service';
import { OutfitItemCandidate } from '../ai/llm/llm-provider.interface';
import { WeatherService } from '../weather/weather.service';
import { buildWeatherInstructions } from '../weather/weather-instructions.util';
import { ClosetItem } from '../../prisma/generated/prisma';
import { GenerateOutfitDto } from './dto/generate-outfit.dto';
import { ListSavedOutfitsQueryDto } from './dto/list-saved-outfits-query.dto';
import {
  DAILY_OUTFIT_CACHE_TTL_SECONDS,
  DEFAULT_DAILY_OUTFIT_CONTEXT,
} from './constants';
import { getOccasionGuidance } from './occasion-guidance';

/** Occasion guidance is always applied; caller-supplied instructions (e.g.
 * Phase 5's weather guidance) are layered on top rather than replacing it. */
function combineInstructions(
  context: string,
  extra?: string,
): string | undefined {
  return (
    [getOccasionGuidance(context), extra].filter(Boolean).join(' ') || undefined
  );
}

function toCandidate(item: ClosetItem): OutfitItemCandidate {
  return {
    id: item.id,
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    color: item.color ?? 'unknown',
    tags: item.tags,
  };
}

@Injectable()
export class OutfitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LLMService,
    private readonly cache: CacheService,
    private readonly weatherService: WeatherService,
  ) {}

  /** Only items whose AI detection has finished are usable — the LLM needs
   * type/category/color to reason about coherence, which PENDING/PROCESSING/
   * FAILED items don't have yet. */
  private getCandidateItems(userId: string) {
    return this.prisma.closetItem.findMany({
      where: { ownerId: userId, archived: false, status: 'DONE' },
    });
  }

  async generate(
    userId: string,
    dto: GenerateOutfitDto,
    extraInstructions?: string,
  ) {
    const items = await this.getCandidateItems(userId);
    if (items.length < 2) {
      throw new BadRequestException(
        'Not enough closet items with completed detection to generate an outfit — add more items first.',
      );
    }

    const generated = await this.llmService.generateOutfit({
      context: dto.context,
      items: items.map(toCandidate),
      extraInstructions: combineInstructions(dto.context, extraInstructions),
    });

    return this.persistOutfit(
      userId,
      dto.context,
      items,
      generated.itemIds,
      generated.explanation,
    );
  }

  async shuffle(userId: string, id: string) {
    const previous = await this.findOne(userId, id);
    const items = await this.getCandidateItems(userId);
    if (items.length < 2) {
      throw new BadRequestException(
        'Not enough closet items with completed detection to generate an outfit — add more items first.',
      );
    }

    const generated = await this.llmService.generateOutfit({
      context: previous.context,
      items: items.map(toCandidate),
      excludeItemIds: previous.items.map((item) => item.id),
      extraInstructions: combineInstructions(previous.context),
    });

    return this.persistOutfit(
      userId,
      previous.context,
      items,
      generated.itemIds,
      generated.explanation,
    );
  }

  private async persistOutfit(
    userId: string,
    context: string,
    candidateItems: ClosetItem[],
    itemIds: string[],
    explanation: string,
  ) {
    // Structured output only guarantees the JSON *shape* — it doesn't stop
    // the model from inventing an ID that isn't actually in the closet, so
    // every returned ID is checked against the candidate set before it's
    // allowed to become a foreign-key connect.
    const validIds = new Set(candidateItems.map((item) => item.id));
    const filteredIds = itemIds.filter((itemId) => validIds.has(itemId));
    if (filteredIds.length === 0) {
      throw new InternalServerErrorException(
        'The outfit generator did not return any valid items',
      );
    }

    return this.prisma.outfit.create({
      data: {
        ownerId: userId,
        context,
        explanation,
        items: { connect: filteredIds.map((itemId) => ({ id: itemId })) },
      },
      include: { items: true },
    });
  }

  async findOne(userId: string, id: string) {
    const outfit = await this.prisma.outfit.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!outfit || outfit.ownerId !== userId) {
      throw new NotFoundException('Outfit not found');
    }
    return outfit;
  }

  async save(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.outfit.update({
      where: { id },
      data: { saved: true },
      include: { items: true },
    });
  }

  async unsave(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.outfit.update({
      where: { id },
      data: { saved: false },
      include: { items: true },
    });
  }

  /**
   * Weather-aware suggestion, generated once per user per calendar day (UTC)
   * — reopening the app the same day returns the cached outfit instead of
   * calling the LLM again. The cache holds only the outfit ID; the outfit
   * itself is durable, so a Redis flush just means the next request
   * regenerates instead of losing data.
   */
  async getTodaysOutfit(userId: string) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD, UTC
    const cacheKey = `daily-outfit:${userId}:${today}`;

    const cachedOutfitId = await this.cache.get<string>(cacheKey);
    if (cachedOutfitId) {
      const cachedOutfit = await this.prisma.outfit.findUnique({
        where: { id: cachedOutfitId },
        include: { items: true },
      });
      if (cachedOutfit) {
        return cachedOutfit;
      }
    }

    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (profile?.latitude == null || profile?.longitude == null) {
      throw new BadRequestException(
        'Set your location in your profile (PATCH /user/profile) first.',
      );
    }

    const weather = await this.weatherService.getCurrentWeather(
      profile.latitude,
      profile.longitude,
    );
    const outfit = await this.generate(
      userId,
      { context: DEFAULT_DAILY_OUTFIT_CONTEXT },
      buildWeatherInstructions(weather),
    );

    await this.cache.set(cacheKey, outfit.id, DAILY_OUTFIT_CACHE_TTL_SECONDS);
    return outfit;
  }

  async listSaved(userId: string, query: ListSavedOutfitsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = { ownerId: userId, saved: true };

    const [items, total] = await Promise.all([
      this.prisma.outfit.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.outfit.count({ where }),
    ]);

    return { items, total, page, limit };
  }
}
