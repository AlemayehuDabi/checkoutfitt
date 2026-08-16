import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StyleCoachService } from './style-coach.service';

@Controller('style-coach')
export class StyleCoachController {
  constructor(private readonly styleCoachService: StyleCoachService) {}

  // POST rather than GET: it runs an analysis and overwrites stored state.
  // 200 rather than 201 — it replaces the user's single style profile
  // instead of creating a new resource each time.
  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  analyze(@CurrentUser() user: CurrentUser) {
    return this.styleCoachService.analyze(user.id);
  }

  @Get()
  getProfile(@CurrentUser() user: CurrentUser) {
    return this.styleCoachService.getProfile(user.id);
  }

  @Post('tips')
  @HttpCode(HttpStatus.OK)
  tips(@CurrentUser() user: CurrentUser) {
    return this.styleCoachService.tips(user.id);
  }
}
