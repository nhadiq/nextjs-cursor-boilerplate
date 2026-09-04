import type { Meta, StoryObj } from '@storybook/react';
import { OrgCreateForm } from './org-create-form';

const meta: Meta<typeof OrgCreateForm> = {
  title: 'Org/OrgCreateForm',
  component: OrgCreateForm,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof OrgCreateForm>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  globals: { locale: 'ar' },
};
