# Deploying to Vercel

This boilerplate targets **Vercel** for production builds and hosting. GitHub Actions runs lint, tests, and security checks only — **not** `next build`. Vercel runs the production build on deploy.

## Prerequisites

- A [Vercel](https://vercel.com) account
- A PostgreSQL database (Vercel Postgres, Neon, or Supabase)
- An [Upstash Redis](https://upstash.com) instance for rate limiting in production
- A [Resend](https://resend.com) account for transactional email

## 1. Import the repository

1. Push this repo to GitHub.
2. In Vercel: **Add New Project** → import the repository.
3. Framework preset: **Next.js**
4. Build command: `pnpm build` (default)
5. Install command: `pnpm install`

## 2. Environment variables

Set these in the Vercel dashboard for **Preview** and **Production** environments.

| Variable                          | Preview                                    | Production                | Notes                                      |
| --------------------------------- | ------------------------------------------ | ------------------------- | ------------------------------------------ |
| `DATABASE_URL`                    | Neon branch or Vercel Postgres dev         | Production DB URL         | See [postgresql.md](./postgresql.md)       |
| `BETTER_AUTH_SECRET`              | Unique preview secret                      | Unique prod secret        | `openssl rand -base64 32`                  |
| `BETTER_AUTH_URL`                 | `https://<preview>.vercel.app`             | `https://yourdomain.com`  | Must match deployed URL                    |
| `NEXT_PUBLIC_APP_URL`             | Same as `BETTER_AUTH_URL`                  | Same as `BETTER_AUTH_URL` | Public-facing app URL                      |
| `RESEND_API_KEY`                  | Resend test key                            | Resend production key     | Required for password reset & verification |
| `EMAIL_FROM`                      | `onboarding@resend.dev` or verified domain | `noreply@yourdomain.com`  | Must be a verified Resend sender           |
| `UPSTASH_REDIS_REST_URL`          | Upstash dev instance                       | Upstash prod instance     | Required in production (`src/env.ts`)      |
| `UPSTASH_REDIS_REST_TOKEN`        | Dev token                                  | Prod token                | Required in production                     |
| `GOOGLE_CLIENT_ID`                | Optional                                   | Optional                  | OAuth                                      |
| `GOOGLE_CLIENT_SECRET`            | Optional                                   | Optional                  | OAuth                                      |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | `false` or `true`                          | `false` or `true`         | OAuth toggle                               |

## 3. Database migrations

Run migrations against your production database before or during the first deploy:

```bash
DATABASE_URL="postgresql://..." pnpm db:migrate
```

For Vercel Postgres, use the connection string from the Vercel dashboard.

## 4. Security headers

Security headers are configured in [`vercel.json`](../vercel.json). CSP is also set in `next.config.ts` for additional coverage.

## 5. Custom domain

1. Add your domain in Vercel → **Settings → Domains**.
2. Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the custom domain.
3. Add the domain as an authorized redirect URI in Google Cloud Console if using OAuth.

## 6. Post-deploy checklist

- [ ] Sign up / sign in works
- [ ] Personal org is created on signup
- [ ] Password reset email delivers (Resend)
- [ ] Email verification email delivers
- [ ] Org switcher and member invites work
- [ ] Rate limiting returns 429 on repeated `/api/auth/*` requests

## Local preview of production build

```bash
pnpm build
pnpm start
```

## Troubleshooting

| Issue                          | Fix                                                     |
| ------------------------------ | ------------------------------------------------------- |
| `BETTER_AUTH_SECRET` too short | Must be ≥ 32 characters                                 |
| Auth callback 404              | `BETTER_AUTH_URL` must match deployed origin exactly    |
| Emails not sending             | Check `RESEND_API_KEY` and verified `EMAIL_FROM` domain |
| Rate limit errors in prod      | Set Upstash Redis env vars                              |
| Prisma errors on deploy        | Run `prisma migrate deploy` in build step or manually   |
