/**
 * Rate Limiting & Request Utils
 * IP-based limits to prevent bot abuse
 * NO PNR storage - fetch, display, discard
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// In-memory IP rate limiter (Replace with Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS = {
  PNR_CHECK: { requests: 10, windowMs: 60000 }, // 10 per minute
  TRAIN_STATUS: { requests: 20, windowMs: 60000 }, // 20 per minute
  SEAT_AVAILABILITY: { requests: 30, windowMs: 60000 }, // 30 per minute
};

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip.trim();
}

/**
 * Check rate limit for IP address
 * Returns: { allowed: boolean, remaining: number, retryAfter: number }
 */
export function checkRateLimit(
  ip: string,
  limit: (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS]
): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + limit.windowMs });
    return { allowed: true, remaining: limit.requests - 1, retryAfter: 0 };
  }

  if (record.count >= limit.requests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit.requests - record.count,
    retryAfter: 0,
  };
}

/**
 * Rate limit middleware for API routes
 */
export function withRateLimit(limit: (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS]) {
  return (handler: any) => {
    return async (request: NextRequest) => {
      const ip = getClientIp(request);
      const rateLimit = checkRateLimit(ip, limit);

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'You are checking too frequently. Please retry in ' + rateLimit.retryAfter + ' seconds.',
            retryAfter: rateLimit.retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(rateLimit.retryAfter),
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }

      const response = await handler(request);
      response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
      return response;
    };
  };
}

export { RATE_LIMITS };
