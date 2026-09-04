import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from './skip-link';

const meta: Meta<typeof SkipLink> = {
  title: 'Layout/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  args: { label: 'Skip to content' },
};
export const Dark: Story = {
  args: { label: 'Skip to content' },
  parameters: { themes: { themeOverride: 'dark' } },
};
export const RTL: Story = {
  args: { label: 'انتقل إلى المحتوى' },
  globals: { locale: 'ar' },
};
