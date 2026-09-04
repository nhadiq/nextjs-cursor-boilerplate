'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/hooks/use-auth';
import { withAuth } from '@/components/auth/with-auth';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function DashboardPage() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('title')}</h1>

        {user && !user.emailVerified && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {tAuth('emailNotVerified')}{' '}
              <Link href="/auth/verify-email" className="font-medium underline">
                {tAuth('resendVerification')}
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('welcome', { name: user?.name || user?.email || '' })}
              </CardTitle>
              <CardDescription>{t('authenticated')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('protectedRoute')}</p>
              <Button asChild>
                <Link href="/profile">{t('viewProfile')}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('authDetails')}</CardTitle>
              <CardDescription>{t('authInfo')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>{t('userId')}:</strong> {user?.id}
              </div>
              <div>
                <strong>{tAuth('email')}:</strong> {user?.email}
              </div>
              <div>
                <strong>{t('emailVerified')}:</strong>{' '}
                {user?.emailVerified ? t('yes') : t('no')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('actions')}</CardTitle>
              <CardDescription>{t('thingsYouCanDo')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">{t('goToHome')}</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile">{t('editProfile')}</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/settings/organization">{tCommon('settings')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

export default withAuth(DashboardPage);
