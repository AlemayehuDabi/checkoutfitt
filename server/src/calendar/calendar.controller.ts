import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CalendarService } from './calendar.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ListCalendarQueryDto } from './dto/list-calendar-query.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@CurrentUser() user: CurrentUser, @Body() dto: CreateScheduleDto) {
    return this.calendarService.create(user.id, dto);
  }

  @Get()
  listByMonth(
    @CurrentUser() user: CurrentUser,
    @Query() query: ListCalendarQueryDto,
  ) {
    return this.calendarService.listByMonth(user.id, query);
  }

  @Get(':date')
  findByDate(@CurrentUser() user: CurrentUser, @Param('date') date: string) {
    return this.calendarService.findByDate(user.id, date);
  }

  @Patch(':date')
  update(
    @CurrentUser() user: CurrentUser,
    @Param('date') date: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.calendarService.update(user.id, date, dto);
  }

  @Delete(':date')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: CurrentUser, @Param('date') date: string) {
    return this.calendarService.remove(user.id, date);
  }
}
