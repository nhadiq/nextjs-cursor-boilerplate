'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks/use-auth';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { redirectTo?: string } = {},
) {
  const { redirectTo = '/auth/signin' } = options;

  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const t = useTranslations('common');

    useEffect(() => {
      if (!loading && !user) {
        router.push(
          `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
      }
    }, [loading, user, router]);

    if (loading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">{t('loading')}</div>
        </div>
      );
    }

    if (!user) return null;

    return <Component {...props} />;
  };
}
