import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';

/**
 * Liveness probe: answers "is this process up and serving?" without touching
 * the database or Redis, so it stays meaningful even while a dependency is
 * degraded (and can't be knocked over by a slow one).
 *
 * Unthrottled, because a monitor polling every few seconds is exactly the
 * traffic pattern rate limiting is meant to stop.
 */
@Controller('health')
export class HealthController {
  @Public()
  @SkipThrottle()
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
