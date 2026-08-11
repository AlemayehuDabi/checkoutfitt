import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
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
}
