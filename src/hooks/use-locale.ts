'use client';

import { useLocale as useNextIntlLocale } from 'next-intl';
import { localeDirections, type Locale } from '@/i18n/routing';

export function useLocale() {
  const locale = useNextIntlLocale() as Locale;
  const dir = localeDirections[locale];

  return { locale, dir };
}
