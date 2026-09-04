'use client';

import { Suspense, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SignInForm() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { signIn, signInWithGoogle } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signIn(email, password);
      router.push(redirect);
      router.refresh();
    } catch {
      setAuthError(t('signInError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('password')}</Label>
            <Link
              href="/auth/reset-password"
              className="text-muted-foreground text-sm hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('signingIn') : t('signIn')}
        </Button>
      </form>
      {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true' && (
        <Button
          variant="outline"
          type="button"
          className="mt-4 w-full"
          onClick={() => signInWithGoogle()}
          disabled={isSubmitting}
        >
          {t('google')}
        </Button>
      )}
      <p className="mt-4 text-center text-sm">
        {t('noAccount')}{' '}
        <Link href="/auth/signup" className="font-semibold hover:underline">
          {t('signUp')}
        </Link>
      </p>
    </>
  );
}

export default function SignInPage() {
  const t = useTranslations('auth');
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('welcomeBack')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t('signInDescription')}
          </p>
        </div>
        <Suspense
          fallback={<div className="text-center text-sm">{t('signingIn')}</div>}
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
