import { render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { withAuth } from '@/components/auth/with-auth';
import en from '../../messages/en.json';

const mockPush = vi.fn();

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = vi.fn();

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}));

function TestComponent() {
  return <div>Protected Content</div>;
}

const Protected = withAuth(TestComponent);

function renderWithIntl(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe('withAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      value: { pathname: '/en/dashboard' },
      writable: true,
    });
  });

  it('shows loading state while auth is resolving', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    renderWithIntl(<Protected />);

    expect(screen.getByText(en.common.loading)).toBeInTheDocument();
  });

  it('redirects unauthenticated users to sign in', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    renderWithIntl(<Protected />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/auth/signin?redirect=%2Fen%2Fdashboard',
      );
    });
  });

  it('renders the wrapped component for authenticated users', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      loading: false,
    });

    renderWithIntl(<Protected />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('returns null while redirecting unauthenticated users', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    const { container } = renderWithIntl(<Protected />);

    expect(container.firstChild).toBeNull();
  });
});
