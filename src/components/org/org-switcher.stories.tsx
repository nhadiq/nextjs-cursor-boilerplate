import type { Meta, StoryObj } from '@storybook/react';
import { OrgSwitcher } from './org-switcher';

const meta: Meta<typeof OrgSwitcher> = {
  title: 'Org/OrgSwitcher',
  component: OrgSwitcher,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrgSwitcher>;

export const Default: Story = {};
export const Dark: Story = {
  parameters: { themes: { themeOverride: 'dark' } },
};
export const RTL: Story = { globals: { locale: 'ar' } };
