import type { Meta, StoryObj } from '@storybook/react';
import { RoleBadge } from '@/components/org/role-badge';

const meta: Meta<typeof RoleBadge> = {
  title: 'Layout/UserNav',
  component: RoleBadge,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof RoleBadge>;

export const Default: Story = { args: { role: 'owner' } };

export const Dark: Story = {
  args: { role: 'member' },
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  args: { role: 'admin' },
  globals: { locale: 'ar' },
};
