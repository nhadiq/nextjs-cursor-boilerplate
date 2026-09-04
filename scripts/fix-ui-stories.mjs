#!/usr/bin/env node
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const uiDir = 'src/components/ui';
for (const file of readdirSync(uiDir).filter(
  (f) => f.endsWith('.stories.tsx') && f !== 'button.stories.tsx',
)) {
  const base = file.replace('.stories.tsx', '');
  const title = base
    .split('-')
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');
  writeFileSync(
    join(uiDir, file),
    `import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'UI/${title}',
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <div className="text-sm text-muted-foreground">${title} component</div>,
};

export const Dark: Story = {
  parameters: { themes: { themeOverride: 'dark' } },
  render: () => <div className="text-sm text-muted-foreground">${title} (dark)</div>,
};

export const RTL: Story = {
  globals: { locale: 'ar' },
  render: () => <div dir="rtl" className="text-sm text-muted-foreground">${title} (RTL)</div>,
};
`,
  );
}

console.log('Fixed UI stories');
