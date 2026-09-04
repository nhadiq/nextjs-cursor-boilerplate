'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InvitePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations('org');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/signin?redirect=/invite/${id}`);
    }
  }, [authLoading, user, router, id]);

  async function handleAccept() {
    setLoading(true);
    setError(null);
    try {
      const result = await authClient.organization.acceptInvitation({
        invitationId: id,
      });
      if (result.error) {
        setError(result.error.message ?? tCommon('error'));
        return;
      }
      router.push('/dashboard');
    } catch {
      setError(tCommon('error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    setError(null);
    try {
      const result = await authClient.organization.rejectInvitation({
        invitationId: id,
      });
      if (result.error) {
        setError(result.error.message ?? tCommon('error'));
        return;
      }
      router.push('/');
    } catch {
      setError(tCommon('error'));
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('acceptInvite')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={handleAccept} disabled={loading}>
              {t('acceptInvite')}
            </Button>
            <Button variant="outline" onClick={handleReject} disabled={loading}>
              {t('rejectInvite')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
