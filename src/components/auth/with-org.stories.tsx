import type { Meta, StoryObj } from '@storybook/react';
import { withOrg } from './with-org';

const DemoContent = () => (
  <div className="rounded-md border p-6 text-sm">
    Organization-scoped content.
  </div>
);

const ProtectedOrgDemo = withOrg(DemoContent);

const meta: Meta = {
  title: 'Auth/WithOrg',
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' }, layout: 'centered' },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ProtectedOrgDemo />,
};

export const Dark: Story = {
  render: () => <ProtectedOrgDemo />,
  parameters: { themes: { themeOverride: 'dark' } },
};

export const RTL: Story = {
  render: () => <ProtectedOrgDemo />,
  globals: { locale: 'ar' },
};
