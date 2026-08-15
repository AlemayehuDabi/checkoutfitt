import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GapAnalysisService } from './gap-analysis.service';

/**
 * Computed analyses over the closet. Mounted at `closet` alongside
 * ClosetController (`closet/items`) — the paths don't overlap, and these are
 * derived read-only views rather than CRUD over closet items.
 */
@Controller('closet')
export class InsightsController {
  constructor(private readonly gapAnalysisService: GapAnalysisService) {}

  @Get('gap-analysis')
  gapAnalysis(@CurrentUser() user: CurrentUser) {
    return this.gapAnalysisService.analyze(user.id);
  }
}
