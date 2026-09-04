import { z } from 'zod';

const optionalNonEmptyString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    GOOGLE_CLIENT_ID: optionalNonEmptyString,
    GOOGLE_CLIENT_SECRET: optionalNonEmptyString,
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: z
      .enum(['true', 'false'])
      .optional()
      .default('false'),
    RESEND_API_KEY: optionalNonEmptyString,
    EMAIL_FROM: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.string().email().optional(),
    ),
    STRIPE_SECRET_KEY: optionalNonEmptyString,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalNonEmptyString,
    UPSTASH_REDIS_REST_URL: optionalUrl,
    UPSTASH_REDIS_REST_TOKEN: optionalNonEmptyString,
  })
  .superRefine((data, ctx) => {
    // next build sets NODE_ENV=production locally; require Upstash only on Vercel production runtime
    const isVercelProduction = process.env.VERCEL_ENV === 'production';
    if (!isVercelProduction) {
      return;
    }
    if (!data.UPSTASH_REDIS_REST_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['UPSTASH_REDIS_REST_URL'],
        message: 'Required on Vercel production',
      });
    }
    if (!data.UPSTASH_REDIS_REST_TOKEN) {
      ctx.addIssue({
        code: 'custom',
        path: ['UPSTASH_REDIS_REST_TOKEN'],
        message: 'Required on Vercel production',
      });
    }
  });

export const env = envSchema.parse(process.env);
