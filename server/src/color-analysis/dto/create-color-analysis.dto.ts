import { IsString } from 'class-validator';

export class CreateColorAnalysisDto {
  // An Attachment ID from the existing upload pipeline, resolved server-side
  // to an owned attachment's secureUrl — same trust pattern as outfit rating.
  @IsString()
  attachmentId: string;
}
