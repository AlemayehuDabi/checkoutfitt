import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { UPLOAD_PURPOSES } from '../constants';
import type { UploadPurpose } from '../constants';

export class SignUploadDto {
  @IsIn(UPLOAD_PURPOSES)
  purpose: UploadPurpose;

  // Requests an eager `background_removal` transformation at upload time, so
  // a ready-to-use cutout URL exists immediately instead of on first delivery.
  @IsOptional()
  @IsBoolean()
  removeBackground?: boolean;
}
