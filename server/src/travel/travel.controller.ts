import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TravelService } from './travel.service';
import { PackTripDto } from './dto/pack-trip.dto';

@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  // 200: generated on demand, nothing is persisted.
  @Post('pack')
  @HttpCode(HttpStatus.OK)
  pack(@CurrentUser() user: CurrentUser, @Body() dto: PackTripDto) {
    return this.travelService.pack(user.id, dto);
  }
}
