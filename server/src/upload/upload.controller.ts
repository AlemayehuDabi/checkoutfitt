import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadService } from './upload.service';
import { SignUploadDto } from './dto/sign-upload.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('sign')
  sign(@CurrentUser() user: CurrentUser, @Body() dto: SignUploadDto) {
    return this.uploadService.sign(user.id, dto);
  }

  @Post('confirm')
  confirm(@CurrentUser() user: CurrentUser, @Body() dto: ConfirmUploadDto) {
    return this.uploadService.confirm(user.id, dto);
  }
}
