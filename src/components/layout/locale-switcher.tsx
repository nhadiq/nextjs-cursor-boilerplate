'use client';

import { useLocale as useNextIntlLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LocaleSwitcher() {
  const t = useTranslations('common');
  const locale = useNextIntlLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(nextLocale) => {
        router.replace(pathname, { locale: nextLocale });
      }}
    >
      <SelectTrigger className="w-[140px]" aria-label={t('language')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((l) => (
          <SelectItem key={l} value={l}>
            {l === 'en' ? t('localeEnglish') : t('localeArabic')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
