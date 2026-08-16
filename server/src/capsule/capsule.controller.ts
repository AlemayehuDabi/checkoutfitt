import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiRateLimit } from '../common/throttling';
import { CapsuleService } from './capsule.service';
import { GenerateCapsuleDto } from './dto/generate-capsule.dto';

@Controller('capsule')
export class CapsuleController {
  constructor(private readonly capsuleService: CapsuleService) {}

  // 200: generated on demand, nothing is persisted.
  @AiRateLimit()
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  generate(@CurrentUser() user: CurrentUser, @Body() dto: GenerateCapsuleDto) {
    return this.capsuleService.generate(user.id, dto);
  }
}
