import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListChatMessagesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;

  // ID of the oldest message already loaded — pass it back to page further
  // into history. Omit for the most recent page.
  @IsOptional()
  @IsString()
  cursor?: string;
}
