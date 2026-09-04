import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '@/env';

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

/** Auth endpoints: 10 requests per minute per identifier (IP). */
export const AUTH_RATE_LIMIT = 10;
export const AUTH_RATE_WINDOW_MS = 60_000;

const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

function createInMemoryLimiter(limit: number, windowMs: number) {
  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const entry = inMemoryStore.get(identifier);

      if (!entry || now >= entry.resetAt) {
        inMemoryStore.set(identifier, { count: 1, resetAt: now + windowMs });
        return {
          success: true,
          limit,
          remaining: limit - 1,
          reset: now + windowMs,
        };
      }

      if (entry.count >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: entry.resetAt,
        };
      }

      entry.count += 1;
      inMemoryStore.set(identifier, entry);

      return {
        success: true,
        limit,
        remaining: limit - entry.count,
        reset: entry.resetAt,
      };
    },
  };
}

function createUpstashLimiter(
  limit: number,
  window: `${number} m` | `${number} s`,
) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL!,
    token: env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
  });

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const result = await ratelimit.limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    },
  };
}

type AuthLimiter = {
  limit(identifier: string): Promise<RateLimitResult>;
};

const hasUpstash =
  Boolean(env.UPSTASH_REDIS_REST_URL) && Boolean(env.UPSTASH_REDIS_REST_TOKEN);

const authLimiter: AuthLimiter = hasUpstash
  ? createUpstashLimiter(AUTH_RATE_LIMIT, '1 m')
  : createInMemoryLimiter(AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS);

/** Seconds until the rate limit window resets (for Retry-After header). */
export function getRetryAfterSeconds(reset: number): number {
  return Math.max(Math.ceil((reset - Date.now()) / 1000), 1);
}

export async function rateLimitAuth(
  identifier: string,
): Promise<RateLimitResult> {
  return authLimiter.limit(identifier);
}
