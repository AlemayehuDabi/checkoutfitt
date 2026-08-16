import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiRateLimit } from '../common/throttling';
import { InspirationService } from './inspiration.service';
import { MatchInspirationDto } from './dto/match-inspiration.dto';

@Controller('inspiration')
export class InspirationController {
  constructor(private readonly inspirationService: InspirationService) {}

  // 200: a one-shot analysis, nothing is persisted.
  @AiRateLimit()
  @Post('match')
  @HttpCode(HttpStatus.OK)
  match(@CurrentUser() user: CurrentUser, @Body() dto: MatchInspirationDto) {
    return this.inspirationService.match(user.id, dto);
  }
}
