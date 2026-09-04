'use client';

import { useLocale } from 'next-intl';
import { authClient } from '@/lib/auth-client';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function useAuth() {
  const locale = useLocale();
  const { data: session, isPending, error } = authClient.useSession();

  const user = session?.user ?? null;

  return {
    user,
    loading: isPending,
    error: error ?? null,
    signUp: async (email: string, password: string, name?: string) => {
      const result = await authClient.signUp.email({
        email,
        password,
        name: name ?? email.split('@')[0] ?? 'User',
      });

      if (result.error) {
        throw new Error(result.error.message ?? 'Sign up failed');
      }

      return result;
    },
    signIn: async (email: string, password: string) => {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message ?? 'Sign in failed');
      }

      return result;
    },
    signInWithGoogle: async () => {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: `/${locale}/dashboard`,
      });

      if (result.error) {
        throw new Error(result.error.message ?? 'Google sign in failed');
      }

      return result;
    },
    signOut: async () => {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message ?? 'Sign out failed');
      }

      return result;
    },
    resetPassword: async (email: string) => {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `/${locale}/auth/reset-password`,
      });

      if (result.error) {
        throw new Error(result.error.message ?? 'Password reset failed');
      }

      return result;
    },
  };
}
