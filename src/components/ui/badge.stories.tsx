import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Badge' },
};

export const Dark: Story = {
  ...Default,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  ...Default,
  globals: { locale: 'ar' },
};
