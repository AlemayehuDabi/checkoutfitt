import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  CLOSET_ITEM_TYPES,
  DEFAULT_CLOSET_PAGE_SIZE,
  MAX_CLOSET_PAGE_SIZE,
} from '../constants';
import type { ClosetItemTypeValue } from '../constants';

export class ListClosetItemsQueryDto {
  @IsOptional()
  @IsIn(CLOSET_ITEM_TYPES)
  type?: ClosetItemTypeValue;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @Transform(
    ({ value }: { value: unknown }) => value === 'true' || value === true,
  )
  @IsBoolean()
  archived?: boolean;

  // Same offset-pagination shape as GET /outfits/saved.
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(MAX_CLOSET_PAGE_SIZE)
  limit?: number = DEFAULT_CLOSET_PAGE_SIZE;
}
