import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Rate limits per authenticated user, falling back to IP.
 *
 * The default tracker keys purely on IP, which punishes real users: a whole
 * office or a carrier-NAT'd mobile network shares one address, so one heavy
 * user would exhaust the budget for everyone behind it. Keying on the user
 * id gives each account its own allowance.
 *
 * The fallback matters because guard execution order isn't guaranteed — if
 * this runs before the auth guard, `req.user` isn't populated yet and IP is
 * the only thing available. Unauthenticated routes (sign-in, sign-up) are
 * IP-limited for the same reason, which is what you'd want there anyway.
 */
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const user = req.user as { id?: string } | undefined;
    if (user?.id) {
      return Promise.resolve(`user:${user.id}`);
    }
    const ips = req.ips as string[] | undefined;
    const ip = (ips?.length ? ips[0] : (req.ip as string)) ?? 'unknown';
    return Promise.resolve(`ip:${ip}`);
  }
}
