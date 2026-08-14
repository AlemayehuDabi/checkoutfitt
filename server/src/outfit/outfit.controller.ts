import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OutfitService } from './outfit.service';
import { GenerateOutfitDto } from './dto/generate-outfit.dto';
import { ListSavedOutfitsQueryDto } from './dto/list-saved-outfits-query.dto';

@Controller('outfits')
export class OutfitController {
  constructor(private readonly outfitService: OutfitService) {}

  @Post('generate')
  generate(@CurrentUser() user: CurrentUser, @Body() dto: GenerateOutfitDto) {
    return this.outfitService.generate(user.id, dto);
  }

  @Post(':id/shuffle')
  shuffle(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.outfitService.shuffle(user.id, id);
  }

  @Post(':id/save')
  save(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.outfitService.save(user.id, id);
  }

  @Post(':id/unsave')
  unsave(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.outfitService.unsave(user.id, id);
  }

  // Both must be declared before ':id' — otherwise Nest matches them as an :id.
  @Get('saved')
  listSaved(
    @CurrentUser() user: CurrentUser,
    @Query() query: ListSavedOutfitsQueryDto,
  ) {
    return this.outfitService.listSaved(user.id, query);
  }

  @Get('today')
  getTodaysOutfit(@CurrentUser() user: CurrentUser) {
    return this.outfitService.getTodaysOutfit(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.outfitService.findOne(user.id, id);
  }
}
