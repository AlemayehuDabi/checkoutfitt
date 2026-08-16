import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { OUTFIT_CONTEXTS } from '../../outfit/constants';
import type { OutfitContextValue } from '../../outfit/constants';
import {
  CAPSULE_SEASONS,
  DEFAULT_CAPSULE_SIZE,
  MAX_CAPSULE_SIZE,
  MIN_CAPSULE_SIZE,
} from '../constants';
import type { CapsuleSeason } from '../constants';

export class GenerateCapsuleDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_CAPSULE_SIZE)
  @Max(MAX_CAPSULE_SIZE)
  maxItems?: number = DEFAULT_CAPSULE_SIZE;

  // Reuses the outfit generator's occasion taxonomy, so a capsule optimized
  // for "interview" means the same thing everywhere else in the app.
  // Defaults to everyday wear when omitted.
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(1)
  @ArrayMaxSize(OUTFIT_CONTEXTS.length)
  @IsIn(OUTFIT_CONTEXTS, { each: true })
  occasions?: OutfitContextValue[];

  @IsOptional()
  @IsIn(CAPSULE_SEASONS)
  season?: CapsuleSeason;
}
