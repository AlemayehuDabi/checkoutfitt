import { IsIn, IsOptional, IsString } from 'class-validator';
import { OUTFIT_CONTEXTS } from '../../outfit/constants';
import type { OutfitContextValue } from '../../outfit/constants';

export class CreateOutfitRatingDto {
  // An Attachment ID from the existing upload pipeline, not a raw URL —
  // resolved server-side to an owned attachment's secureUrl, the same trust
  // pattern as closet ingestion and chat attachments.
  @IsString()
  attachmentId: string;

  // Constrained to the same occasion taxonomy the outfit generator uses, so
  // a rating for "interview" is judged against identical styling rules.
  // Omitted means the outfit is judged for general everyday wear.
  @IsOptional()
  @IsIn(OUTFIT_CONTEXTS)
  occasion?: OutfitContextValue;
}
