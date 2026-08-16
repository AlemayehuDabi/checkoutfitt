import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertPublicImageUrl } from './image-url.util';

export interface ImageSourceInput {
  attachmentId?: string;
  imageUrl?: string;
}

/**
 * Resolves "an uploaded attachment or an external URL" to a single image URL.
 *
 * Shared by the shopping and inspiration endpoints, which both accept either
 * source under different field names. An attachment is resolved to its
 * secureUrl only after ownership is proven; an external URL goes through the
 * SSRF checks in image-url.util.ts and comes back as the post-redirect
 * target that was actually validated.
 */
export async function resolveImageSource(
  prisma: PrismaService,
  userId: string,
  input: ImageSourceInput,
  urlFieldName: string,
): Promise<string> {
  if (input.attachmentId && input.imageUrl) {
    throw new BadRequestException(
      `Provide either attachmentId or ${urlFieldName}, not both`,
    );
  }

  if (input.attachmentId) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: input.attachmentId },
    });
    if (!attachment || attachment.ownerId !== userId) {
      throw new NotFoundException('Attachment not found');
    }
    return attachment.secureUrl;
  }

  if (input.imageUrl) {
    return assertPublicImageUrl(input.imageUrl);
  }

  throw new BadRequestException(
    `Provide either attachmentId or ${urlFieldName}`,
  );
}
