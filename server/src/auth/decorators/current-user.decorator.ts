import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';

export type CurrentUser = UserSession['user'];

/**
 * The global AuthGuard (from @thallesp/nestjs-better-auth) attaches the
 * authenticated user to `req.user` for every request that passes it. This
 * just lifts that value into a controller parameter.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUser }>();
    return request.user;
  },
);
