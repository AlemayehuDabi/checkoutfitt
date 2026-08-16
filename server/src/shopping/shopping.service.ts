import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { LLMService } from '../ai/llm/llm.service';
import { VisionService } from '../ai/vision/vision.service';
import { ClosetService } from '../closet/closet.service';
import { ClosetItem } from '../../prisma/generated/prisma';
import { assertPublicImageUrl } from '../common/image-url.util';
import { EvaluateProductDto } from './dto/evaluate-product.dto';
import {
  MAX_ITEMS_IN_SHOPPING_PROMPT,
  MAX_SUGGESTED_OUTFITS,
  SHOPPING_EVAL_CACHE_TTL_SECONDS,
  SHOPPING_VERDICTS,
  ShoppingVerdict,
} from './constants';
import {
  buildShoppingPrompt,
  ProductDescriptor,
  SHOPPING_EVALUATION_JSON_SCHEMA,
  SHOPPING_SYSTEM_PROMPT,
  ShoppingClosetItem,
  ShoppingEvaluationPayload,
} from './shopping.schema';

export interface SuggestedOutfitItem {
  closetItemId: string;
  type: string;
  category: string;
  imageUrl: string;
}

export interface ShoppingEvaluationResult {
  product: ProductDescriptor;
  verdict: ShoppingVerdict;
  verdictReason: string;
  newOutfitCount: number;
  duplicateRisk: boolean;
  gapFill: boolean;
  suggestedOutfits: { name: string; items: SuggestedOutfitItem[] }[];
  generatedAt: string;
}

function toShoppingItem(item: ClosetItem): ShoppingClosetItem {
  return {
    id: item.id,
    type: (item.type ?? 'other').toLowerCase(),
    category: item.category ?? 'unknown',
    color: item.color ?? 'unknown',
    tags: item.tags,
  };
}

@Injectable()
export class ShoppingService {
  private readonly logger = new Logger(ShoppingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly llmService: LLMService,
    private readonly visionService: VisionService,
    private readonly closetService: ClosetService,
  ) {}

  /** Resolves the request to a single image URL, whichever source was used. */
  private async resolveImageUrl(
    userId: string,
    dto: EvaluateProductDto,
  ): Promise<string> {
    if (dto.attachmentId && dto.productImageUrl) {
      throw new BadRequestException(
        'Provide either attachmentId or productImageUrl, not both',
      );
    }

    if (dto.attachmentId) {
      const attachment = await this.prisma.attachment.findUnique({
        where: { id: dto.attachmentId },
      });
      if (!attachment || attachment.ownerId !== userId) {
        throw new NotFoundException('Attachment not found');
      }
      return attachment.secureUrl;
    }

    if (dto.productImageUrl) {
      // Validates the host is public and actually serving an image, and
      // returns the post-redirect URL so we use the target we checked.
      return assertPublicImageUrl(dto.productImageUrl);
    }

    throw new BadRequestException(
      'Provide either attachmentId or productImageUrl',
    );
  }

  async evaluate(
    userId: string,
    dto: EvaluateProductDto,
  ): Promise<ShoppingEvaluationResult> {
    const imageUrl = await this.resolveImageUrl(userId, dto);

    const cacheKey = `shopping-eval:${userId}:${createHash('sha256')
      .update(imageUrl)
      .digest('hex')}`;
    const cached = await this.cache.get<ShoppingEvaluationResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // Reuses the existing garment detector rather than a second vision
    // prompt; its `tags` are the style descriptors this feature calls "style".
    const detected = await this.visionService.detectGarment(imageUrl);
    const product: ProductDescriptor = {
      type: (detected.type ?? 'other').toLowerCase(),
      category: detected.category ?? 'unknown',
      color: detected.color ?? 'unknown',
      style: Array.isArray(detected.tags) ? detected.tags.join(', ') : '',
    };

    const items = await this.closetService.list(userId, { archived: false });
    const sample = items.slice(0, MAX_ITEMS_IN_SHOPPING_PROMPT);

    const payload =
      await this.llmService.generateStructured<ShoppingEvaluationPayload>({
        prompt: buildShoppingPrompt(
          product,
          sample.map(toShoppingItem),
          items.length,
        ),
        schema: SHOPPING_EVALUATION_JSON_SCHEMA,
        schemaName: 'shopping_evaluation',
        systemPrompt: SHOPPING_SYSTEM_PROMPT,
      });

    const result: ShoppingEvaluationResult = {
      product,
      ...this.normalize(payload, items),
      generatedAt: new Date().toISOString(),
    };

    await this.cache.set(cacheKey, result, SHOPPING_EVAL_CACHE_TTL_SECONDS);
    return result;
  }

  private normalize(
    payload: ShoppingEvaluationPayload,
    items: ClosetItem[],
  ): Omit<ShoppingEvaluationResult, 'product' | 'generatedAt'> {
    const byId = new Map(items.map((item) => [item.id, item]));

    // Same hallucination guard as outfit generation: item IDs the model
    // returns are only trusted if they exist in this user's closet.
    const suggestedOutfits = (
      Array.isArray(payload.suggestedOutfits) ? payload.suggestedOutfits : []
    )
      .map((outfit) => ({
        name: typeof outfit?.name === 'string' ? outfit.name : 'Suggested look',
        items: (Array.isArray(outfit?.itemIds) ? outfit.itemIds : [])
          .map((id) => byId.get(id))
          .filter((item): item is ClosetItem => Boolean(item))
          .map((item) => ({
            closetItemId: item.id,
            type: (item.type ?? 'other').toLowerCase(),
            category: item.category ?? 'unknown',
            imageUrl: item.imageUrl,
          })),
      }))
      // An outfit whose every ID was invented carries no information.
      .filter((outfit) => outfit.items.length > 0)
      .slice(0, MAX_SUGGESTED_OUTFITS);

    const verdict = SHOPPING_VERDICTS.includes(
      payload.verdict as ShoppingVerdict,
    )
      ? (payload.verdict as ShoppingVerdict)
      : 'maybe';
    if (verdict !== payload.verdict) {
      this.logger.warn(
        `Shopping evaluation returned unknown verdict "${payload.verdict}", defaulting to "maybe"`,
      );
    }

    const newOutfitCount = Number(payload.newOutfitCount);

    return {
      verdict,
      verdictReason:
        typeof payload.verdictReason === 'string' ? payload.verdictReason : '',
      newOutfitCount: Number.isFinite(newOutfitCount)
        ? Math.max(0, Math.round(newOutfitCount))
        : 0,
      duplicateRisk: Boolean(payload.duplicateRisk),
      gapFill: Boolean(payload.gapFill),
      suggestedOutfits,
    };
  }
}
