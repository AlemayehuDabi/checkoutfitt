import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { DATE_ONLY_PATTERN } from '../date.util';

export class CreateScheduleDto {
  @IsString()
  outfitId: string;

  @Matches(DATE_ONLY_PATTERN, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
