import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { type: 'email', placeholder: 'Email' },
};

export const Dark: Story = {
  ...Default,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  ...Default,
  globals: { locale: 'ar' },
};
