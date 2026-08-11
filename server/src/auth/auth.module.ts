import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // NOTE: `disableControllers: true` looks tempting here since we expose
    // our own DTO-validated routes below instead of Better Auth's
    // auto-mounted ones — but the library implements that flag by swapping
    // in a module subclass whose `configure()` is a no-op, which *also*
    // skips re-adding the body-parser middleware (main.ts disables Nest's
    // default one so Better Auth can read raw request bodies). With
    // controllers disabled, every other route — including this module's own
    // AuthController — would receive an empty `req.body`. So we leave
    // Better Auth's own routes mounted at `basePath` ("/api/auth"); they sit
    // unused alongside our "/auth/*" routes, which is harmless. The global
    // AuthGuard this module registers still protects routes and still
    // powers @Session()/@Public()/@Optional() everywhere.
    BetterAuthModule.forRoot({ auth }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
