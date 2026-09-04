'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { IntlErrorCode } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        onError={(error) => {
          if (error.code === IntlErrorCode.ENVIRONMENT_FALLBACK) {
            return;
          }
          console.error(error);
        }}
        getMessageFallback={({ namespace, key, error }) => {
          if (error?.code === IntlErrorCode.ENVIRONMENT_FALLBACK) {
            return `${namespace ?? 'common'}.${key}`;
          }
          return key;
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
