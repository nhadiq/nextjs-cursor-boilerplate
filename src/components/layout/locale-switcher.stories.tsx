import type { Meta, StoryObj } from '@storybook/react';
import { LocaleSwitcher } from './locale-switcher';

const meta: Meta<typeof LocaleSwitcher> = {
  title: 'Layout/LocaleSwitcher',
  component: LocaleSwitcher,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof LocaleSwitcher>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  globals: { locale: 'ar' },
};
