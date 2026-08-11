import { IsIn, IsString } from 'class-validator';
import { UPLOAD_PURPOSES } from '../constants';
import type { UploadPurpose } from '../constants';

export class ConfirmUploadDto {
  // The client reports back only the publicId Cloudinary assigned; every
  // other field (url, format, bytes, dimensions) is re-fetched from
  // Cloudinary's own Admin API in UploadService rather than trusted from the
  // client, so a client can't register an Attachment pointing at fabricated
  // metadata.
  @IsString()
  publicId: string;

  @IsIn(UPLOAD_PURPOSES)
  purpose: UploadPurpose;
}
