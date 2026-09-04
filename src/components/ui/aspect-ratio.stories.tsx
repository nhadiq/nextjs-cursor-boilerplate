import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta: Meta = {
  title: 'UI/AspectRatio',
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted overflow-hidden rounded-md"
      >
        <div className="text-muted-foreground flex h-full items-center justify-center">
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Dark: Story = {
  render: Default.render,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  render: Default.render,
  globals: { locale: 'ar' },
};
