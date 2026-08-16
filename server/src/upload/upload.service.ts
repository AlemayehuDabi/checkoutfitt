import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import { AttachmentPurpose } from '../../prisma/generated/prisma';
import { ALLOWED_IMAGE_FORMATS, MAX_UPLOAD_BYTES } from './constants';
import type { UploadPurpose } from './constants';
import { SignUploadDto } from './dto/sign-upload.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';

function toAttachmentPurpose(purpose: UploadPurpose): AttachmentPurpose {
  return purpose.toUpperCase() as AttachmentPurpose;
}

@Injectable()
export class UploadService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get<string>('cloudinary.cloudName'),
      api_key: this.config.get<string>('cloudinary.apiKey'),
      api_secret: this.config.get<string>('cloudinary.apiSecret'),
      secure: true,
    });
  }

  /**
   * Every user/purpose pair gets its own Cloudinary folder. This is also how
   * `confirm()` proves a client is confirming an asset it was actually
   * signed to upload, rather than someone else's public_id.
   */
  private folderFor(userId: string, purpose: UploadPurpose): string {
    return `checkoutfitt/${purpose}/${userId}`;
  }

  sign(userId: string, dto: SignUploadDto) {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = this.folderFor(userId, dto.purpose);

    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
      allowed_formats: ALLOWED_IMAGE_FORMATS.join(','),
    };
    if (dto.removeBackground) {
      // Prepares a derived cutout at upload time instead of on first
      // delivery, so the mobile app never eats the transform latency.
      paramsToSign.eager = 'e_background_removal';
    }

    const apiSecret = this.config.get<string>('cloudinary.apiSecret') as string;
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/${this.config.get<string>('cloudinary.cloudName')}/image/upload`,
      cloudName: this.config.get<string>('cloudinary.cloudName'),
      apiKey: this.config.get<string>('cloudinary.apiKey'),
      timestamp,
      signature,
      folder,
      allowedFormats: ALLOWED_IMAGE_FORMATS,
      ...(dto.removeBackground ? { eager: 'e_background_removal' } : {}),
    };
  }

  /**
   * Deletes an asset from Cloudinary. Used when the record that owned it is
   * removed, so deleted garments don't leave paid-for blobs behind.
   */
  async destroy(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }

  async confirm(userId: string, dto: ConfirmUploadDto) {
    const existing = await this.prisma.attachment.findUnique({
      where: { publicId: dto.publicId },
    });
    if (existing) {
      if (existing.ownerId !== userId) {
        throw new ForbiddenException('This asset does not belong to you');
      }
      return existing;
    }

    const expectedFolder = this.folderFor(userId, dto.purpose);
    if (!dto.publicId.startsWith(`${expectedFolder}/`)) {
      throw new ForbiddenException(
        'This asset was not uploaded to your folder',
      );
    }

    interface CloudinaryResource {
      public_id: string;
      format: string;
      bytes: number;
      width?: number;
      height?: number;
      url: string;
      secure_url: string;
    }
    let resource: CloudinaryResource;
    try {
      resource = (await cloudinary.api.resource(dto.publicId, {
        resource_type: 'image',
      })) as CloudinaryResource;
    } catch {
      throw new NotFoundException(
        'Upload not found on Cloudinary — did the upload actually complete?',
      );
    }

    if (
      !ALLOWED_IMAGE_FORMATS.includes(
        resource.format as (typeof ALLOWED_IMAGE_FORMATS)[number],
      )
    ) {
      await cloudinary.uploader
        .destroy(resource.public_id)
        .catch(() => undefined);
      throw new BadRequestException(
        `Unsupported image format "${resource.format}"`,
      );
    }
    if (resource.bytes > MAX_UPLOAD_BYTES) {
      await cloudinary.uploader
        .destroy(resource.public_id)
        .catch(() => undefined);
      throw new BadRequestException(
        `Image exceeds the ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB limit`,
      );
    }

    return this.prisma.attachment.create({
      data: {
        ownerId: userId,
        publicId: resource.public_id,
        url: resource.url,
        secureUrl: resource.secure_url,
        format: resource.format,
        bytes: resource.bytes,
        width: resource.width,
        height: resource.height,
        purpose: toAttachmentPurpose(dto.purpose),
      },
    });
  }
}
