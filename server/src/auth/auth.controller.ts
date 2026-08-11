import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  AuthService,
  Optional,
  Public,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { auth } from './auth';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SocialSignInDto } from './dto/social-sign-in.dto';
import { PrismaService } from '../prisma/prisma.service';

const SOCIAL_PROVIDERS = ['google', 'apple'] as const;
type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService<typeof auth>,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpDto, @Req() req: Request) {
    const result = await this.authService.api.signUpEmail({
      body: { name: dto.name, email: dto.email, password: dto.password },
      headers: fromNodeHeaders(req.headers),
    });
    return { user: result.user, token: result.token };
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto, @Req() req: Request) {
    const result = await this.authService.api.signInEmail({
      body: {
        email: dto.email,
        password: dto.password,
        rememberMe: dto.rememberMe,
      },
      headers: fromNodeHeaders(req.headers),
    });
    return { user: result.user, token: result.token };
  }

  @Public()
  @Post('social/:provider')
  @HttpCode(HttpStatus.OK)
  async socialSignIn(
    @Param('provider') provider: string,
    @Body() dto: SocialSignInDto,
    @Req() req: Request,
  ) {
    if (!SOCIAL_PROVIDERS.includes(provider as SocialProvider)) {
      throw new BadRequestException(
        `Unsupported provider "${provider}". Use one of: ${SOCIAL_PROVIDERS.join(', ')}`,
      );
    }

    const result = await this.authService.api.signInSocial({
      body: {
        provider: provider,
        idToken: {
          token: dto.idToken,
          nonce: dto.nonce,
          accessToken: dto.accessToken,
        },
      },
      headers: fromNodeHeaders(req.headers),
    });

    // Passing an idToken always signs the user in directly (no redirect), so
    // the "redirect" branch of this union is unreachable in practice — this
    // guard just satisfies the type checker without an `as` cast.
    if (!('user' in result)) {
      throw new BadRequestException('Social sign-in failed');
    }

    return { user: result.user, token: result.token };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req: Request) {
    await this.authService.api.signOut({
      headers: fromNodeHeaders(req.headers),
    });
    return { success: true };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    await this.authService.api.requestPasswordReset({
      body: { email: dto.email },
      headers: fromNodeHeaders(req.headers),
    });
    // Always return the same message regardless of whether the email is
    // registered, so this endpoint can't be used to enumerate accounts.
    return {
      message:
        'If an account exists for this email, a password reset link has been sent.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    await this.authService.api.resetPassword({
      body: { newPassword: dto.newPassword, token: dto.token },
      headers: fromNodeHeaders(req.headers),
    });
    return { message: 'Password has been reset successfully.' };
  }

  @Optional()
  @Get('session')
  async getSession(@Session() session: UserSession | undefined) {
    if (!session) {
      return { user: null, profile: null };
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    return { user: session.user, profile };
  }
}
