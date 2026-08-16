import { IsOptional, IsString, MaxLength } from 'class-validator';

export class TodaysOutfitQueryDto {
  /**
   * IANA time zone (e.g. "Europe/Lisbon") deciding when "today" rolls over.
   * Validated by Intl when it's used, so the list stays current with the
   * runtime rather than a hardcoded enum. Omitted means UTC.
   */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;
}
