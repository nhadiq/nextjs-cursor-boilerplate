## Current State (Sep 2026)

- **Phase 0–3 boilerplate implemented**: security foundation, theme tokens, WCAG a11y, i18n/RTL, Storybook, Makefile/Husky/CI, Vitest/Playwright, multitenancy, app polish, Vercel docs
- Auth: Better Auth with email/password, Google OAuth (optional), email verification, Resend emails
- Multitenancy: Better Auth organization plugin — personal org on signup, RBAC, org switcher, settings routes
- i18n: next-intl with `en` + `ar` locales, RTL support, `[locale]` routing via `middleware.ts`
- Database: Prisma 7 + SQLite (dev); org schema in `prisma/schema.prisma` — run `pnpm db:push` or `pnpm db:migrate` on fresh clone
- Quality gate: `make check` (lint, format, typecheck, security-audit, i18n, vitest, storybook-build, a11y)
- Deploy docs: `docs/deployment-vercel.md`, `docs/postgresql.md`

## Open Questions / What's Next

- [ ] E2E tests for org invitation accept flow (Playwright)
- [ ] Integration test for personal org auto-creation on signup
- [ ] Sentry error monitoring (deferred v2)
- [ ] Stripe payments (deferred v2)

## Architecture Decisions

| Decision                                  | Why                                                        |
| ----------------------------------------- | ---------------------------------------------------------- |
| Better Auth over Firebase/Supabase        | Self-hosted sessions, TypeScript-first, no vendor lock-in  |
| Prisma 7 + SQLite for dev                 | Zero-config local setup; swap to PostgreSQL for production |
| Better Auth organization plugin           | Official multitenancy with session `activeOrganizationId`  |
| Session-based active org (not subdomains) | Simpler v1; subdomain tenancy deferred                     |
| Resend for email                          | Vercel-friendly, simple API for reset + verification       |
| `middleware.ts` (not proxy.ts)            | Merged locale routing + auth guard + rate limiting         |
| Vercel for production builds              | CI runs lint/test only; Vercel owns `next build`           |
| Graphify for code intelligence            | Query-first exploration via AST graph                      |
| Graphify outputs gitignored (Sep 2026)    | Local-only graph; regenerated on bootstrap and post-merge  |

## What Was Tried / Learnt

- (Sep 2026) Prisma 7 requires `prisma.config.ts` and driver adapters for SQLite
- (Sep 2026) Personal org created via `databaseHooks.user.create.after` in auth.ts
- (Sep 2026) Existing SQLite DB from `db:push` requires `migrate reset` or baseline before `migrate dev` — migration SQL committed for fresh clones
- (Sep 2026) `react-resizable-panels` v4 renamed exports: `Group`, `Panel`, `Separator`
