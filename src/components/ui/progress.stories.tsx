import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: { value: 60, className: 'w-[300px]' },
};

export const Dark: Story = {
  ...Default,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  ...Default,
  globals: { locale: 'ar' },
};
