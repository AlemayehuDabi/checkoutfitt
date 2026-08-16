import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DATE_ONLY_PATTERN } from '../../calendar/date.util';
import { TRAVEL_OCCASIONS } from '../constants';
import type { TravelOccasion } from '../constants';

export class PackTripDto {
  // A city name ("Lisbon", "Paris,FR") or inline coordinates ("48.85,2.35").
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  destination: string;

  @Matches(DATE_ONLY_PATTERN, { message: 'startDate must be YYYY-MM-DD' })
  startDate: string;

  @Matches(DATE_ONLY_PATTERN, { message: 'endDate must be YYYY-MM-DD' })
  endDate: string;

  // What's planned on the trip. Omitted means general travel.
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(TRAVEL_OCCASIONS.length)
  @IsIn(TRAVEL_OCCASIONS, { each: true })
  occasions?: TravelOccasion[];
}
