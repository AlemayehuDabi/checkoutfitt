import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLMService } from '../ai/llm/llm.service';
import { OutfitItemCandidate } from '../ai/llm/llm-provider.interface';
import { ClosetItem } from '../../prisma/generated/prisma';
import { GenerateOutfitDto } from './dto/generate-outfit.dto';

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
      extraInstructions,
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

  listSaved(userId: string) {
    return this.prisma.outfit.findMany({
      where: { ownerId: userId, saved: true },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
