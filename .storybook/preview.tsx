import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import '../src/app/globals.css';
import en from '../messages/en.json';
import ar from '../messages/ar.json';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English (LTR)' },
          { value: 'ar', title: 'Arabic (RTL)' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      name: 'Theme',
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
    (Story, context) => {
      const locale = (context.globals.locale as 'en' | 'ar') ?? 'en';
      const theme = (context.globals.theme as 'light' | 'dark') ?? 'light';
      const dir = locale === 'ar' ? 'rtl' : 'ltr';
      const messages = locale === 'ar' ? ar : en;

      return (
        <ThemeProvider
          attribute="class"
          forcedTheme={theme}
          enableSystem={false}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div dir={dir} className="bg-background text-foreground p-4">
              <Story />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
