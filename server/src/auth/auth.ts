import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { importPKCS8, SignJWT } from 'jose';
import { PrismaClient } from '../../prisma/generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Apple requires the OAuth `client_secret` to be a short-lived JWT signed
 * with the private key downloaded from the Apple Developer portal, not a
 * static string. It must be regenerated before APPLE_KEY expires (Apple
 * caps the JWT lifetime at 6 months).
 */
async function generateAppleClientSecret() {
  const { APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY } =
    process.env;
  if (
    !APPLE_CLIENT_ID ||
    !APPLE_TEAM_ID ||
    !APPLE_KEY_ID ||
    !APPLE_PRIVATE_KEY
  ) {
    throw new Error('Missing Apple sign-in environment variables');
  }
  const key = await importPKCS8(
    APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    'ES256',
  );
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: APPLE_KEY_ID })
    .setIssuer(APPLE_TEAM_ID)
    .setSubject(APPLE_CLIENT_ID)
    .setAudience('https://appleid.apple.com')
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60 * 24 * 30)
    .sign(key);
}

/**
 * Sends the password-reset link through Resend.
 *
 * Called via a plain fetch rather than the SDK — it's one POST, and the
 * dependency would buy nothing. With no RESEND_API_KEY configured it falls
 * back to logging the link, so the reset flow stays testable locally without
 * anyone needing an email account.
 *
 * A send failure is logged rather than thrown: the caller
 * (POST /auth/forgot-password) deliberately returns the same response
 * whether or not the address exists, and surfacing an error here would leak
 * that distinction.
 */
async function sendResetPasswordEmail(
  email: string,
  url: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[auth] password reset link for ${email}: ${url}`);
    return;
  }

  const from = process.env.FROM_EMAIL ?? 'CheckoutFitt <onboarding@resend.dev>';
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Reset your CheckoutFitt password',
        html: `<p>We received a request to reset your CheckoutFitt password.</p>
<p><a href="${url}">Reset your password</a></p>
<p>This link expires in one hour. If you didn't ask for it, you can ignore this email.</p>`,
        text: `Reset your CheckoutFitt password: ${url}\n\nThis link expires in one hour. If you didn't ask for it, you can ignore this email.`,
      }),
    });

    if (!response.ok) {
      console.error(
        `[auth] Resend rejected the reset email (${response.status}): ${await response.text()}`,
      );
    }
  } catch (error) {
    console.error(
      `[auth] Failed to send reset email: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: '/api/auth',
  trustedOrigins: ['https://appleid.apple.com'],

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  // Bearer-token sessions: the mobile app has no cookie jar, so every
  // authenticated request carries `Authorization: Bearer <token>` instead.
  // The plugin reads that header and resolves it to the same session a
  // cookie would, and the sign-in/sign-up responses echo the token back via
  // the `set-auth-token` response header for the client to store.
  plugins: [bearer()],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    sendResetPassword: ({ user, url }) =>
      sendResetPasswordEmail(user.email, url),
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_SECRET && {
      google: {
        // Native Google Sign-In issues a different client ID per platform
        // (web/iOS/Android); the ID token's audience must match one of them.
        clientId: [
          process.env.GOOGLE_WEB_CLIENT_ID,
          process.env.GOOGLE_IOS_CLIENT_ID,
          process.env.GOOGLE_ANDROID_CLIENT_ID,
        ].filter((id): id is string => Boolean(id)),
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    }),
    // Apple's provider factory is invoked eagerly during Better Auth's
    // startup (not lazily on first sign-in), so it's only registered when
    // credentials are actually present — otherwise the app would fail to
    // boot in any environment without Apple configured yet.
    ...(process.env.APPLE_CLIENT_ID &&
      process.env.APPLE_TEAM_ID &&
      process.env.APPLE_KEY_ID &&
      process.env.APPLE_PRIVATE_KEY && {
        apple: async () => ({
          clientId: process.env.APPLE_CLIENT_ID as string,
          clientSecret: await generateAppleClientSecret(),
          appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER,
        }),
      }),
  },

  session: {
    // How long an issued session/bearer token stays valid without use.
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    // Sliding refresh: a session used within this window has its expiry
    // pushed forward automatically, so active users are never logged out.
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Auto-provision an empty Profile row the moment a user account exists,
  // so the mobile app can PATCH it during the style quiz instead of the
  // client having to create it as a separate step.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.profile.create({
            data: { userId: user.id },
          });
        },
      },
    },
  },
});
