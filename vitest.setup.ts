import '@testing-library/jest-dom/vitest';

process.env.DATABASE_URL ??= 'file:./prisma/dev.db';
process.env.BETTER_AUTH_SECRET ??=
  'test-secret-with-at-least-32-characters-long';
process.env.BETTER_AUTH_URL ??= 'http://localhost:3000';
process.env.NEXT_PUBLIC_APP_URL ??= 'http://localhost:3000';
