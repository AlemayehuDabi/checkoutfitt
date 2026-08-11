import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { GENDER_PRESENTATIONS, STYLE_PREFERENCES } from '../constants';
import type { GenderPresentation, StylePreference } from '../constants';

export class UpdateProfileDto {
  @IsOptional()
  @IsIn(GENDER_PRESENTATIONS)
  genderPresentation?: GenderPresentation;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(STYLE_PREFERENCES, { each: true })
  stylePreferences?: StylePreference[];

  @IsOptional()
  @IsString()
  @MaxLength(20)
  sizeTop?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  sizeBottom?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  sizeShoe?: string;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;

  // Used by weather-based outfit suggestions (Phase 5). Send latitude and
  // longitude together — WeatherService looks up conditions by coordinates.
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;
}
