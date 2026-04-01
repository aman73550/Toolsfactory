/**
 * API Route: /api/train-status/[trainNumber]
 *
 * Fetches real-time train status from available sources
 * NO DUMMY DATA - returns error if sources unavailable
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchFromNTES, fetchFromGoogle, TrainStatus, DATA_UNAVAILABLE_MESSAGE } from '@/server/utils/railway-data-fetcher';
import { RATE_LIMITS, checkRateLimit, getClientIp } from '@/server/utils/rate-limit';

// Dynamic route parameter extraction
export async function GET(
  request: NextRequest,
  { params }: { params: { trainNumber: string } }
) {
  const trainNumber = params.trainNumber.toUpperCase();

  // Validate train number format
  if (!/^\d{5}$/.test(trainNumber)) {
    return NextResponse.json(
      {
        error: 'Invalid train number',
        message: 'Train number must be 5 digits (e.g., 12345)',
      },
      { status: 400 }
    );
  }

  // Apply rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, RATE_LIMITS.TRAIN_STATUS);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Please wait ${rateLimit.retryAfter} seconds before checking again.`,
        retryAfter: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfter) },
      }
    );
  }

  try {
    // Try multiple sources in order
    let trainStatus: TrainStatus | null = null;

    // Source 1: NTES (National Train Enquiry System)
    trainStatus = await fetchFromNTES(trainNumber);
    if (trainStatus) {
      return NextResponse.json(trainStatus);
    }

    // Source 2: Google Trains
    trainStatus = await fetchFromGoogle(trainNumber);
    if (trainStatus) {
      return NextResponse.json(trainStatus);
    }

    // If no source worked, return honest error
    return NextResponse.json(
      {
        error: 'Data unavailable',
        message: 'Railway servers are currently unreachable. Please try again in a few moments or check NTES.gov.in directly.',
        trainNumber,
        timestamp: new Date().toISOString(),
        helpText: 'For most reliable information, visit https://www.ntes.indianrailways.gov.in/',
      },
      { status: 503 }
    );
  } catch (error) {
    console.error(`Error fetching train status for ${trainNumber}:`, error);

    return NextResponse.json(
      {
        error: 'Service error',
        message: 'An error occurred while fetching train status. Please try again.',
        trainNumber,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
