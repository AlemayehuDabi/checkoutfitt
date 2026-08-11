import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CLOSET_ITEM_TYPES } from '../constants';
import type { ClosetItemTypeValue } from '../constants';

/** Used both by manual correction of AI-detected fields and by archiving. */
export class UpdateClosetItemDto {
  @IsOptional()
  @IsIn(CLOSET_ITEM_TYPES)
  type?: ClosetItemTypeValue;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}
