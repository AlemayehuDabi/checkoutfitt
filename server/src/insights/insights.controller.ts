import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GapAnalysisService } from './gap-analysis.service';
import { ClosetValueService } from './closet-value.service';

/**
 * Computed analyses over the closet. Mounted at `closet` alongside
 * ClosetController (`closet/items`) — the paths don't overlap, and these are
 * derived read-only views rather than CRUD over closet items.
 */
@Controller('closet')
export class InsightsController {
  constructor(
    private readonly gapAnalysisService: GapAnalysisService,
    private readonly closetValueService: ClosetValueService,
  ) {}

  @Get('gap-analysis')
  gapAnalysis(@CurrentUser() user: CurrentUser) {
    return this.gapAnalysisService.analyze(user.id);
  }

  @Get('value')
  closetValue(@CurrentUser() user: CurrentUser) {
    return this.closetValueService.calculate(user.id);
  }
}
