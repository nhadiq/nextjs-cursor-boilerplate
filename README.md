# Next.js Cursor Boilerplate

A production-ready Next.js boilerplate with **Better Auth**, **multitenancy**, **Prisma**, **i18n (en/ar + RTL)**, **Tailwind CSS**, and **Shadcn UI**.

## What's Included

| Feature           | Description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Auth              | [Better Auth](https://www.better-auth.com/) — email/password, verification, optional Google OAuth |
| Multitenancy      | Better Auth organization plugin — personal org on signup, RBAC, org switcher                      |
| Database          | Prisma 7 + SQLite (local dev), PostgreSQL for production                                          |
| i18n              | next-intl with English + Arabic, RTL support                                                      |
| Frontend          | Tailwind CSS 4, Shadcn UI, app shell with sidebar                                                 |
| Email             | Resend for password reset and email verification                                                  |
| Route protection  | `proxy.ts` — locale routing, auth guard, rate limiting (Next.js 16)                               |
| Quality           | Vitest, Playwright, Storybook, axe accessibility tests                                            |
| Deploy            | Vercel (see [docs/deployment-vercel.md](docs/deployment-vercel.md))                               |
| Code intelligence | [Graphify](https://github.com/Graphify-Labs/graphify) knowledge graph                             |

## Getting Started

### 1. Install dependencies

```bash
pnpm install
pnpm bootstrap
```

`pnpm bootstrap` copies `.env.example` → `.env`, generates Prisma client, applies migrations, installs Husky hooks, and builds/updates the local Graphify graph when the CLI is available (`graphify-out/` is gitignored and refreshed on pull via post-merge hook).

### 2. Configure environment

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET=your-32-char-random-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secret:

```bash
openssl rand -base64 32
```

Optional — email (Resend):

```env
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
```

### 3. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route                    | Description                                |
| ------------------------ | ------------------------------------------ |
| `/`                      | Landing page                               |
| `/auth/signin`           | Sign in                                    |
| `/auth/signup`           | Create account (auto-creates personal org) |
| `/auth/reset-password`   | Password reset                             |
| `/auth/verify-email`     | Email verification                         |
| `/dashboard`             | Protected dashboard                        |
| `/profile`               | Editable profile                           |
| `/settings/organization` | Org settings                               |
| `/settings/members`      | Member management                          |
| `/settings/invitations`  | Pending invites                            |
| `/org/new`               | Create additional org                      |
| `/invite/[id]`           | Accept/reject invitation                   |
| `/api/auth/*`            | Better Auth API                            |

## Multitenancy

- Signup auto-creates a personal workspace (`databaseHooks` in `src/lib/auth.ts`)
- Org switcher in app shell header
- RBAC: `owner`, `admin`, `member` — enforced server-side via `src/lib/tenant-guard.ts`
- Server helpers: `src/lib/org-server.ts`, `src/lib/org-permissions.ts`

## Project Structure

```
src/
├── app/[locale]/          # Localized routes
├── actions/               # next-safe-action server actions
├── components/
│   ├── auth/              # withAuth, withOrg HOCs
│   ├── layout/            # AppShell, sidebar, user nav
│   ├── org/               # Org switcher, member management
│   └── profile/           # Profile form
├── hooks/                 # useAuth, useOrganization
├── lib/                   # auth, db, email, tenant-guard
├── services/              # Business logic layer
└── proxy.ts               # Locale + auth + rate limit (Next.js 16)
prisma/
├── schema.prisma
└── migrations/
docs/
├── deployment-vercel.md
└── postgresql.md
```

## Scripts

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `pnpm dev`             | Start dev server                |
| `pnpm build`           | Production build                |
| `pnpm bootstrap`       | Fresh-clone setup               |
| `pnpm db:migrate`      | Create/apply migrations         |
| `pnpm db:push`         | Sync schema (dev fallback)      |
| `pnpm graphify:update` | Refresh code intelligence graph |

## Git Hooks

Pre-commit and pre-push hooks run via Husky + Makefile:

```bash
make pre-commit   # lint-staged
make pre-push     # lint, typecheck, tests, i18n, security-audit
make ci           # same as pre-push
```

Post-merge refreshes the local Graphify graph after `git pull` (optional, non-blocking).

## Switching to PostgreSQL

See [docs/postgresql.md](docs/postgresql.md) for the full adapter setup.

## Deploying to Vercel

See [docs/deployment-vercel.md](docs/deployment-vercel.md) for environment variables and checklist.

## License

[MIT](LICENSE)
