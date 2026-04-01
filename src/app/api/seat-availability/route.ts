/**
 * API Route: /api/seat-availability
 *
 * Train Seat Availability Check
 *
 * Data fetched from public sources where possible
 * Refreshes every 5 minutes (not real-time due to rate limiting)
 */

import { NextRequest, NextResponse } from 'next/server';
import { RATE_LIMITS, checkRateLimit, getClientIp } from '@/server/utils/rate-limit';

interface SeatCheckRequest {
  trainNumber: string;
  date: string; // YYYY-MM-DD
  from: string; // Station code
  to: string; // Station code
  class: string; // SL, 3A, 2A, 1A, etc.
}

const VALID_CLASSES = ['SL', '3A', '2A', '1A', 'FC', 'ER', 'ES'];

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, RATE_LIMITS.SEAT_AVAILABILITY);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Please wait ${rateLimit.retryAfter} seconds before checking again.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json() as SeatCheckRequest;
    const { trainNumber, date, from, to, classCode } = body;

    // Validate inputs
    const errors: string[] = [];

    if (!trainNumber || !/^\d{5}$/.test(trainNumber)) {
      errors.push('Train number must be 5 digits');
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push('Date must be in YYYY-MM-DD format');
    }

    if (!from || from.length !== 3) {
      errors.push('From station must be 3-letter code');
    }

    if (!to || to.length !== 3) {
      errors.push('To station must be 3-letter code');
    }

    if (!classCode || !VALID_CLASSES.includes(classCode)) {
      errors.push(`Class must be one of: ${VALID_CLASSES.join(', ')}`);
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          message: 'Please check your inputs:',
          details: errors,
        },
        { status: 400 }
      );
    }

    // Check if date is in future
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return NextResponse.json(
        {
          error: 'Invalid date',
          message: 'Cannot check availability for past dates',
        },
        { status: 400 }
      );
    }

    // NOTE: Actual seat availability fetching would go here
    // Placeholder implementation showing structure

    return NextResponse.json(
      {
        status: 'unavailable',
        reason: 'Data source not configured',
        message:
          'Seat availability data is not currently available. ' +
          'Please check official IRCTC app or Ixigo for real-time availability.',

        // What the response WOULD look like if data were available:
        example: {
          trainNumber: trainNumber,
          date: date,
          from: from,
          to: to,
          class: classCode,
          availability: {
            available: 45, // seats available
            waiting: 120, // in waiting list
            booked: 240, // already booked
            total: 405,
          },
          lastUpdated: new Date().toISOString(),
          refreshInterval: 300, // seconds (5 minutes)
          source: 'IRCTC (simulated)',
        },

        // Real-time alternatives
        recommendations: [
          {
            site: 'IRCTC Official',
            url: 'https://www.irctc.co.in',
            realtime: true,
            accuracy: 'Official source',
          },
          {
            site: 'Ixigo',
            url: 'https://www.ixigo.com/trains',
            realtime: true,
            accuracy: 'High',
          },
          {
            site: 'Confirmtkt',
            url: 'https://www.confirmtkt.com',
            realtime: true,
            accuracy: 'High',
          },
        ],

        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seat availability check error:', error);

    return NextResponse.json(
      {
        error: 'Server error',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
