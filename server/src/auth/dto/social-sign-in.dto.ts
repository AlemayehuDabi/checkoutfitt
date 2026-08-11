import { IsOptional, IsString } from 'class-validator';

/**
 * The mobile app authenticates with Google/Apple using their native SDKs
 * on-device and hands us the resulting ID token — there's no redirect/callback
 * dance to wrap here, just a token to verify.
 */
export class SocialSignInDto {
  @IsString()
  idToken: string;

  @IsOptional()
  @IsString()
  nonce?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;
}
