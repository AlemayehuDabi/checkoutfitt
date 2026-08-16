import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiRateLimit } from '../common/throttling';
import { OutfitRatingService } from './outfit-rating.service';
import { CreateOutfitRatingDto } from './dto/create-outfit-rating.dto';
import { ListOutfitRatingsQueryDto } from './dto/list-outfit-ratings-query.dto';

@Controller('outfit-rating')
export class OutfitRatingController {
  constructor(private readonly outfitRatingService: OutfitRatingService) {}

  @AiRateLimit()
  @Post()
  create(@CurrentUser() user: CurrentUser, @Body() dto: CreateOutfitRatingDto) {
    return this.outfitRatingService.create(user.id, dto);
  }

  @Get()
  list(
    @CurrentUser() user: CurrentUser,
    @Query() query: ListOutfitRatingsQueryDto,
  ) {
    return this.outfitRatingService.list(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.outfitRatingService.findOne(user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.outfitRatingService.remove(user.id, id);
  }
}
