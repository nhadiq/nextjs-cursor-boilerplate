import type { Meta, StoryObj } from '@storybook/react';
import { RoleBadge } from './role-badge';

const meta: Meta<typeof RoleBadge> = {
  title: 'Org/RoleBadge',
  component: RoleBadge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RoleBadge>;

export const Default: Story = { args: { role: 'member' } };
export const Owner: Story = { args: { role: 'owner' } };
export const Dark: Story = {
  args: { role: 'admin' },
  parameters: { themes: { themeOverride: 'dark' } },
};
export const RTL: Story = {
  args: { role: 'member' },
  globals: { locale: 'ar' },
};
