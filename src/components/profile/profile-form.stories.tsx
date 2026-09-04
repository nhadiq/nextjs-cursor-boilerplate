import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm } from './profile-form';

const meta: Meta<typeof ProfileForm> = {
  title: 'Profile/ProfileForm',
  component: ProfileForm,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof ProfileForm>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  globals: { locale: 'ar' },
};
