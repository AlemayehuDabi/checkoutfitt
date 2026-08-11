import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { CLOSET_ITEM_TYPES } from '../constants';
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
}
