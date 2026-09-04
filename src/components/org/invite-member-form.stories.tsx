import type { Meta, StoryObj } from '@storybook/react';
import { InviteMemberForm } from './invite-member-form';

const meta: Meta<typeof InviteMemberForm> = {
  title: 'Org/InviteMemberForm',
  component: InviteMemberForm,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof InviteMemberForm>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  globals: { locale: 'ar' },
};
