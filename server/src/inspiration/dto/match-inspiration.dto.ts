import { IsOptional, IsString, IsUrl } from 'class-validator';

/**
 * Exactly one of these must be supplied; that's enforced in
 * common/image-source.util.ts so the message can explain both the "neither"
 * and "both" cases plainly.
 */
export class MatchInspirationDto {
  @IsOptional()
  @IsString()
  attachmentId?: string;

  // Checked at request time for being a public host actually serving an
  // image — see common/image-url.util.ts.
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  imageUrl?: string;
}
