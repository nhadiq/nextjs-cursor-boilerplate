import type { Meta, StoryObj } from '@storybook/react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { Button } from './button';
import { ChevronsUpDown } from 'lucide-react';

const meta: Meta = {
  title: 'UI/Collapsible',
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[350px] space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-semibold">3 starred repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">
          @radix-ui/primitives
        </div>
        <div className="rounded-md border px-4 py-2 text-sm">
          @radix-ui/colors
        </div>
      </CollapsibleContent>
    </Collapsible>
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
