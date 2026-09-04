import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerSession } from '@/lib/org-server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const session = await getServerSession();

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('description')}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {session?.user ? (
            <Button asChild>
              <Link href="/dashboard">{t('goToDashboard')}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth/signin">{t('getStarted')}</Link>
            </Button>
          )}
        </div>

        <Card className="text-start">
          <CardHeader>
            <CardTitle>{t('features')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground space-y-2">
              <li>{t('featureAuth')}</li>
              <li>{t('featureI18n')}</li>
              <li>{t('featureOrg')}</li>
              <li>{t('featureA11y')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
