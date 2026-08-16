import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_RATING_PAGE_SIZE, MAX_RATING_PAGE_SIZE } from '../constants';

/** Same offset-pagination shape as GET /outfits/saved. */
export class ListOutfitRatingsQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(MAX_RATING_PAGE_SIZE)
  limit?: number = DEFAULT_RATING_PAGE_SIZE;
}
