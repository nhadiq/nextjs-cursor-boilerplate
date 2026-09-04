import type { Meta, StoryObj } from '@storybook/react';
import { withAuth } from './with-auth';

const DemoContent = () => (
  <div className="rounded-md border p-6 text-sm">
    Protected content visible when authenticated.
  </div>
);

const ProtectedDemo = withAuth(DemoContent);

const meta: Meta = {
  title: 'Auth/WithAuth',
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' }, layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ProtectedDemo />,
};

export const Dark: Story = {
  render: () => <ProtectedDemo />,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  render: () => <ProtectedDemo />,
  globals: { locale: 'ar' },
};
