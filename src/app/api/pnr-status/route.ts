/**
 * API Route: /api/pnr-status
 *
 * PNR Status Check - TRANSPARENT ABOUT LIMITATIONS
 *
 * CRITICAL REALITY:
 * There is NO way to check someone else's PNR status without:
 * 1. IRCTC Login (user's own account)
 * 2. IRCTC Official API (requires paid merchant account)
 * 3. OTP verification (IRCTC SMS-based)
 *
 * This route demonstrates the HONEST approach:
 * - Explains the limitation
 * - Guides users to official methods
 * - Does NOT use dummy/fake data
 */

import { NextRequest, NextResponse } from 'next/server';
import { RATE_LIMITS, checkRateLimit, getClientIp } from '@/server/utils/rate-limit';

const PNR_REGEX = /^\d{10}$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, RATE_LIMITS.PNR_CHECK);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `You've checked too many PNRs. Please wait ${rateLimit.retryAfter} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { pnr } = body;

    // Validate
    if (!pnr || !PNR_REGEX.test(String(pnr).trim())) {
      return NextResponse.json(
        {
          error: 'Invalid PNR',
          message: 'PNR must be 10 digits. Example: 1234567890',
        },
        { status: 400 }
      );
    }

    // HONEST RESPONSE
    return NextResponse.json(
      {
        error: 'Service not available',
        severity: 'info',
        title: 'PNR Status Check - Temporary Limitation',
        message:
          'Free PNR status checking is not currently available. Here is why and what you can do:',

        whyNotAvailable: {
          reason1: 'IRCTC API requires paid merchant credentials',
          reason2: 'PNR is confidential - cannot be checked without authorization',
          reason3: 'Unofficial methods are frequently blocked by IRCTC servers',
        },

        recommendedAlternatives: [
          {
            method: 'Official IRCTC App',
            accuracy: '100% accurate',
            howTo: 'Download IRCTC Rail Connect app and login with your credentials',
            time: 'Instant',
          },
          {
            method: 'IRCTC Website',
            accuracy: '100% accurate',
            howTo: 'Visit www.irctc.co.in > Login > Check Booking Status',
            time: 'Instant',
          },
          {
            method: 'SMS Check',
            accuracy: '100% accurate',
            howTo: 'Reply with PNR to the SMS you received from IRCTC',
            time: '1-2 minutes',
          },
          {
            method: 'Customer Care',
            accuracy: '100% accurate',
            howTo: 'Call IRCTC 139 (toll-free in India)',
            time: 'Varies',
          },
        ],

        futureFeatures: {
          planned: 'Login-based PNR checker (user provides own IRCTC credentials)',
          status: 'Under consideration',
        },

        timestamp: new Date().toISOString(),
      },
      { status: 200 } // 200 = Not an error, just a limitation
    );
  } catch (error) {
    console.error('PNR check error:', error);

    return NextResponse.json(
      {
        error: 'Server error',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
