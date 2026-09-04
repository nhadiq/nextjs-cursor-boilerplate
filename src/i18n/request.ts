import { getRequestConfig } from 'next-intl/server';
import { IntlErrorCode } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'ar')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    onError(error) {
      if (error.code === IntlErrorCode.ENVIRONMENT_FALLBACK) {
        return;
      }
      console.error(error);
    },
    getMessageFallback({ namespace, key, error }) {
      if (error?.code === IntlErrorCode.ENVIRONMENT_FALLBACK) {
        return `${namespace ?? 'common'}.${key}`;
      }
      return key;
    },
  };
});
