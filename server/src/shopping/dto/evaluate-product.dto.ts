import { IsOptional, IsString, IsUrl } from 'class-validator';

/**
 * Exactly one of these must be supplied. That's enforced in ShoppingService
 * rather than with a cross-field validator, so the error message can explain
 * both the "neither" and "both" cases plainly.
 */
export class EvaluateProductDto {
  // An Attachment ID from the existing upload pipeline.
  @IsOptional()
  @IsString()
  attachmentId?: string;

  // An external product image. Beyond URL shape, this is checked at request
  // time for being a public host actually serving an image — see
  // common/image-url.util.ts.
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  productImageUrl?: string;
}
