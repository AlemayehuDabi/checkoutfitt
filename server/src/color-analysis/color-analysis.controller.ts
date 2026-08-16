import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiRateLimit } from '../common/throttling';
import { ColorAnalysisService } from './color-analysis.service';
import { CreateColorAnalysisDto } from './dto/create-color-analysis.dto';

@Controller('color-analysis')
export class ColorAnalysisController {
  constructor(private readonly colorAnalysisService: ColorAnalysisService) {}

  // 200 rather than 201: there is exactly one analysis per user, so a re-run
  // replaces the existing one instead of creating another resource.
  @AiRateLimit()
  @Post()
  @HttpCode(HttpStatus.OK)
  analyze(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateColorAnalysisDto,
  ) {
    return this.colorAnalysisService.analyze(user.id, dto);
  }

  @Get()
  find(@CurrentUser() user: CurrentUser) {
    return this.colorAnalysisService.findForUser(user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: CurrentUser) {
    return this.colorAnalysisService.remove(user.id);
  }
}
