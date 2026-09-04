import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: 'Type your message here.' },
};

export const Dark: Story = {
  ...Default,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  ...Default,
  globals: { locale: 'ar' },
};
