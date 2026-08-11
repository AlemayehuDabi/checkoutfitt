import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClosetService } from './closet.service';
import { IngestClosetItemDto } from './dto/ingest-closet-item.dto';
import { BulkIngestClosetItemsDto } from './dto/bulk-ingest-closet-items.dto';
import { UpdateClosetItemDto } from './dto/update-closet-item.dto';
import { ListClosetItemsQueryDto } from './dto/list-closet-items-query.dto';

@Controller('closet/items')
export class ClosetController {
  constructor(private readonly closetService: ClosetService) {}

  @Post()
  ingest(@CurrentUser() user: CurrentUser, @Body() dto: IngestClosetItemDto) {
    return this.closetService.ingest(user.id, dto);
  }

  @Post('bulk')
  bulkIngest(
    @CurrentUser() user: CurrentUser,
    @Body() dto: BulkIngestClosetItemsDto,
  ) {
    return this.closetService.bulkIngest(user.id, dto);
  }

  @Get()
  list(
    @CurrentUser() user: CurrentUser,
    @Query() query: ListClosetItemsQueryDto,
  ) {
    return this.closetService.list(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.closetService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateClosetItemDto,
  ) {
    return this.closetService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.closetService.remove(user.id, id);
  }
}
