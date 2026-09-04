import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { organization } from 'better-auth/plugins';
import { prisma } from '@/lib/db';
import { env } from '@/env';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email';
import { slugify } from '@/lib/utils';

const googleClientId = env.GOOGLE_CLIENT_ID;
const googleClientSecret = env.GOOGLE_CLIENT_SECRET;

function generateSlug(name: string): string {
  const base = slugify(name);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
        name: user.name,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        verifyUrl: url,
        name: user.name,
      });
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : undefined,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === 'production',
  },
  trustedOrigins: [env.BETTER_AUTH_URL, env.NEXT_PUBLIC_APP_URL],
  plugins: [
    nextCookies(),
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: 'owner',
      membershipLimit: 100,
      invitationExpiresIn: 60 * 60 * 48,
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const slug = generateSlug(user.name || user.email.split('@')[0]);
          const org = await prisma.organization.create({
            data: {
              id: crypto.randomUUID(),
              name: `${user.name}'s Workspace`,
              slug,
              createdAt: new Date(),
              metadata: JSON.stringify({ personal: true }),
            },
          });

          await prisma.member.create({
            data: {
              id: crypto.randomUUID(),
              organizationId: org.id,
              userId: user.id,
              role: 'owner',
              createdAt: new Date(),
            },
          });

          const session = await prisma.session.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
          });

          if (session) {
            await prisma.session.update({
              where: { id: session.id },
              data: { activeOrganizationId: org.id },
            });
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
