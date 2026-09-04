# PostgreSQL Setup

SQLite is used for local development. For production (Vercel, Railway, etc.), switch to PostgreSQL.

## 1. Install dependencies

```bash
pnpm add @prisma/adapter-pg pg
pnpm add -D @types/pg
```

## 2. Update Prisma schema

In `prisma/schema.prisma`, change the datasource provider:

```prisma
datasource db {
  provider = "postgresql"
}
```

## 3. Update the database client

Replace `src/lib/db.ts` with the PostgreSQL adapter:

```ts
import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

## 4. Update Better Auth adapter

In `src/lib/auth.ts`, change the Prisma adapter provider:

```ts
database: prismaAdapter(prisma, {
  provider: "postgresql",
}),
```

## 5. Environment variable

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```

### Vercel Postgres

1. Add **Vercel Postgres** storage to your project.
2. Copy `POSTGRES_URL` (or `DATABASE_URL`) from the Vercel dashboard.
3. Set `DATABASE_URL` in Vercel environment variables.

### Neon

1. Create a project at [neon.tech](https://neon.tech).
2. Use the connection string with `?sslmode=require`.
3. Use Neon **branching** for preview deployments.

## 6. Run migrations

```bash
# Development
pnpm db:migrate

# Production (CI or manual)
pnpm exec prisma migrate deploy
```

## 7. Verify

```bash
DATABASE_URL="postgresql://..." pnpm exec prisma db pull
pnpm dev
```

Sign up a test user and confirm the personal organization is created.

## Notes

- Prisma 7 requires `prisma.config.ts` for the datasource URL — do not add `url` to `schema.prisma`.
- Use connection pooling (PgBouncer or Neon's pooler) for serverless environments.
- SQLite `file:` URLs are for local dev only; never use SQLite in production.
