import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src',
      files: '**/*.stories.@(js|jsx|mjs|ts|tsx)',
      exclude: ['**/profile/**'],
    },
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: '@storybook/nextjs',
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@/hooks/use-auth': path.resolve(dirname, './mocks/use-auth.tsx'),
      '@/hooks/use-organization': path.resolve(
        dirname,
        './mocks/use-organization.tsx',
      ),
      '@/i18n/navigation': path.resolve(dirname, './mocks/navigation.tsx'),
    };
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      async_hooks: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      module: false,
    };
    return config;
  },
};

export default config;
