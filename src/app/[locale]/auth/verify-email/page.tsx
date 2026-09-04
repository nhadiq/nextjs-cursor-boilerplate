'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth-client';

export default function VerifyEmailPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleResend() {
    if (!user?.email) return;
    setLoading(true);
    try {
      await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: `/${locale}/dashboard`,
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold">{t('verifyEmail')}</h1>
        <p className="text-muted-foreground">{t('verifyEmailDescription')}</p>
        {user && !user.emailVerified && (
          <Button
            onClick={handleResend}
            disabled={loading || sent}
            variant="outline"
          >
            {sent ? t('verificationSent') : t('resendVerification')}
          </Button>
        )}
        <Button asChild>
          <Link href="/dashboard">{tCommon('dashboard')}</Link>
        </Button>
      </div>
    </div>
  );
}
