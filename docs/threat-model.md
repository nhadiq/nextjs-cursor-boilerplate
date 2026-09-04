# Threat Model (STRIDE-lite)

## Scope

Better Auth + organization multitenancy + Next.js App Router on Vercel.

| Threat                 | Mitigation                                          |
| ---------------------- | --------------------------------------------------- |
| Spoofing               | Better Auth sessions; secure cookies in production  |
| Tampering              | Signed cookies; Zod validation on inputs            |
| Repudiation            | Auth event logging (no PII)                         |
| Information disclosure | IDOR guards; generic error boundaries in production |
| Denial of service      | Rate limiting on `/api/auth/*`                      |
| Elevation of privilege | Server-side RBAC; tenant isolation tests            |

## Trust boundaries

- Client hooks are untrusted — re-validate on server
- Middleware cookie check is optimistic only
- Org ID from session, never from URL alone
