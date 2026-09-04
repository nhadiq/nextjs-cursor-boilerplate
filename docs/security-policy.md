# Security Policy

See also: [threat-model.md](./threat-model.md) and [../SECURITY.md](../SECURITY.md).

## Authentication

- Better Auth only; no custom password hashing
- Email verification required (`requireEmailVerification: true`)
- Password policy v1: min 8, max 128 (recommend 12+ in production)
- Session expiry: 7 days; cookie cache 5 minutes

## Authorization & multitenancy

- Tenant isolation via `assertOrgMember()` and `requireOrgPermission()`
- RBAC roles: owner, admin, member
- IDOR prevention on all org-scoped queries

## HTTP security

- Security headers + CSP in `next.config.ts` and `vercel.json`
- CSP v1 exception: `unsafe-inline` styles (Tailwind), `unsafe-eval` scripts (Next.js dev tooling)
- Rate limiting on `/api/auth/*` via Upstash (prod) or in-memory (dev)

## Secrets

- Validated at startup via `src/env.ts`
- Upstash required in production
- Never log tokens, passwords, or reset links

## Dependencies

- `make security-audit` runs `pnpm audit --audit-level=high`
- Dependabot enabled

## Incident response

1. Rotate `BETTER_AUTH_SECRET` and session invalidation
2. Review audit logs for auth failures
3. Report vulnerabilities per SECURITY.md
