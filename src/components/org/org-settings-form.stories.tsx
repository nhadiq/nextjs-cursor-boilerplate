import type { Meta, StoryObj } from '@storybook/react';
import { OrgSettingsForm } from './org-settings-form';

const meta: Meta<typeof OrgSettingsForm> = {
  title: 'Org/OrgSettingsForm',
  component: OrgSettingsForm,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof OrgSettingsForm>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  globals: { locale: 'ar' },
};
