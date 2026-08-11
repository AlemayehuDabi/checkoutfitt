import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SendChatMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message: string;

  // A Phase-2 Attachment ID, not a raw URL — resolved server-side to an
  // owned attachment's secureUrl, same trust pattern as closet ingestion.
  @IsOptional()
  @IsString()
  attachmentId?: string;
}
