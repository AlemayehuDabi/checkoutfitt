import { IsString } from 'class-validator';

export class IngestClosetItemDto {
  @IsString()
  attachmentId: string;
}
