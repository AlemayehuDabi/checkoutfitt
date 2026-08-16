import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LLMService } from '../ai/llm/llm.service';
import { CreateColorAnalysisDto } from './dto/create-color-analysis.dto';
import {
  CONTRAST_LEVELS,
  ContrastLevel,
  MAX_BEST_COLORS,
  MAX_SEASON_TRAITS,
  MAX_WORST_COLORS,
  SEASONS,
  Season,
  UNDERTONES,
  Undertone,
} from './constants';
import { cleanStrings, normalizeHexColors } from './color-analysis.normalize';
import {
  COLOR_ANALYSIS_JSON_SCHEMA,
  COLOR_ANALYSIS_PROMPT,
  COLOR_ANALYSIS_SYSTEM_PROMPT,
  ColorAnalysisPayload,
} from './color-analysis.schema';

const ANALYSIS_INCLUDE = { imageAttachment: true };

@Injectable()
export class ColorAnalysisService {
  private readonly logger = new Logger(ColorAnalysisService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LLMService,
  ) {}

  async analyze(userId: string, dto: CreateColorAnalysisDto) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id: dto.attachmentId },
    });
    if (!attachment || attachment.ownerId !== userId) {
      throw new NotFoundException('Attachment not found');
    }

    const payload =
      await this.llmService.generateStructured<ColorAnalysisPayload>({
        prompt: COLOR_ANALYSIS_PROMPT,
        schema: COLOR_ANALYSIS_JSON_SCHEMA,
        schemaName: 'color_analysis',
        systemPrompt: COLOR_ANALYSIS_SYSTEM_PROMPT,
        imageUrls: [attachment.secureUrl],
      });

    // The schema constrains these to enums, but a value outside the taxonomy
    // would otherwise be persisted verbatim and break clients that map
    // season/undertone/contrast onto UI.
    const season = SEASONS.includes(payload.season as Season)
      ? payload.season
      : null;
    const undertone = UNDERTONES.includes(payload.undertone as Undertone)
      ? payload.undertone
      : null;
    const contrast = CONTRAST_LEVELS.includes(payload.contrast as ContrastLevel)
      ? payload.contrast
      : null;

    if (!season || !undertone || !contrast) {
      this.logger.warn(
        `Colour analysis returned out-of-taxonomy values (season=${payload.season}, undertone=${payload.undertone}, contrast=${payload.contrast})`,
      );
    }

    const bestColors = normalizeHexColors(payload.bestColors, MAX_BEST_COLORS);
    const worstColors = normalizeHexColors(
      payload.worstColors,
      MAX_WORST_COLORS,
    );
    if (bestColors.length === 0) {
      this.logger.warn(
        `Colour analysis for attachment ${attachment.id} produced no usable hex colours`,
      );
    }

    const data = {
      imageAttachmentId: attachment.id,
      season: season ?? '',
      seasonTraits: cleanStrings(payload.seasonTraits, MAX_SEASON_TRAITS),
      bestColors,
      worstColors,
      undertone: undertone ?? '',
      contrast: contrast ?? '',
      proTip: typeof payload.proTip === 'string' ? payload.proTip : '',
    };

    // One analysis per user: a re-run replaces the previous result, so the
    // unique ownerId is the upsert target rather than a new row each time.
    return this.prisma.colorAnalysis.upsert({
      where: { ownerId: userId },
      create: { ownerId: userId, ...data },
      update: data,
      include: ANALYSIS_INCLUDE,
    });
  }

  async findForUser(userId: string) {
    const analysis = await this.prisma.colorAnalysis.findUnique({
      where: { ownerId: userId },
      include: ANALYSIS_INCLUDE,
    });
    if (!analysis) {
      throw new NotFoundException(
        'No colour analysis yet. Run POST /color-analysis first.',
      );
    }
    return analysis;
  }

  async remove(userId: string) {
    await this.findForUser(userId);
    await this.prisma.colorAnalysis.delete({ where: { ownerId: userId } });
  }
}
