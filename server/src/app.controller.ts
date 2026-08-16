import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Left behind the global AuthGuard deliberately: `GET /health` is the
   * unauthenticated liveness endpoint, so this greeting has no reason to be
   * public. The e2e spec asserts the resulting 401.
   *
   * (Marking it @Public() also drags better-auth — an ESM package — into
   * this controller's unit spec, which the CommonJS jest transform can't
   * parse.)
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
