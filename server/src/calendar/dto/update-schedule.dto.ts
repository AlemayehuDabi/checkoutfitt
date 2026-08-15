import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Both fields optional so a caller can change just the outfit, just the
 * notes, or both. The date itself isn't updatable — moving an entry to a
 * different day is a DELETE plus a POST, which keeps the one-per-day unique
 * constraint from needing conflict handling on two different paths.
 */
export class UpdateScheduleDto {
  @IsOptional()
  @IsString()
  outfitId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
