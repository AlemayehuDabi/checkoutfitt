import { IsOptional, Matches } from 'class-validator';
import { MONTH_PATTERN } from '../date.util';

export class ListCalendarQueryDto {
  // Omitted means "the current month" (resolved in CalendarService).
  @IsOptional()
  @Matches(MONTH_PATTERN, { message: 'month must be in YYYY-MM format' })
  month?: string;
}
