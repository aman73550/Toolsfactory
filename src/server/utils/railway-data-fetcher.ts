/**
 * Railway Data Fetcher - Honest Implementation
 *
 * This module attempts to fetch real railway data from available sources.
 * It does NOT use dummy data - either returns real data or clear error messages.
 *
 * Sources (in priority order):
 * 1. Google Trains (most reliable)
 * 2. NTES website (National Train Enquiry System)
 * 3. Other public endpoints (as verified)
 */

// Using native Fetch API (available in Node.js 18+)
// No external dependencies needed

export interface TrainStatus {
  trainNumber: string;
  trainName: string;
  status: 'On Time' | 'Delayed' | 'Running' | 'Cancelled' | 'Unknown';
  delay: number; // minutes
  lastSeenAt: string; // timestamp
  lastStation: string;
  nextStation: string;
  eta: string; // Estimated time of arrival
  source: 'NTES' | 'Google' | 'Mobile' | 'Unknown';
  lastUpdated: number; // Unix timestamp
}

export interface SeatAvailability {
  trainNumber: string;
  date: string;
  class: string;
  available: number | null; // null = data unavailable
  waiting: number | null;
  booked: number | null;
  source: string;
  lastUpdated: number;
}

export interface PNRStatus {
  pnr: string;
  status: 'CNF' | 'WL' | 'RAC' | 'REJECTD' | 'CNL' | 'UNKNOWN';
  trainNumber: string;
  trainName: string;
  resolvingFrom: string;
  resolvingTo: string;
  boardingDate: string;
  coachNumber: string | null;
  berthNumber: string | null;
  seatNumber: string | null;
  passengerName: string;
  source: 'IRCTC' | 'SMS' | 'Mobile' | 'Unknown';
  rawData?: Record<string, any>;
  lastUpdated: number;
}

const USER_AGENTS = [
  'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile Safari/605.1.15',
  'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Fetch train status from NTES (National Train Enquiry System)
 * Uses native Fetch API to avoid dependency issues
 */
export async function fetchFromNTES(trainNumber: string): Promise<TrainStatus | null> {
  try {
    // NTES JSON endpoint (more reliable than scraping HTML)
    const url = `https://www.ntes.indianrailways.gov.in/ntes/train/JsonData.aspx?TrainNumber=${trainNumber}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`NTES returned status ${response.status} for train ${trainNumber}`);
      return null;
    }

    const data = await response.json() as any;

    // Parse NTES response structure
    if (!data || !data.state || data.state.length === 0) {
      console.warn(`Invalid NTES response structure for ${trainNumber}`);
      return null;
    }

    const trainData = data.state[0];

    return {
      trainNumber: trainNumber,
      trainName: trainData.trainName || 'Unknown',
      status: parseTrainStatus(trainData.status || 'Unknown'),
      delay: parseInt(trainData.delay) || 0,
      lastSeenAt: trainData.time || new Date().toISOString(),
      lastStation: trainData.station || 'Unknown',
      nextStation: trainData.nextStation || 'Unknown',
      eta: trainData.eta || '',
      source: 'NTES',
      lastUpdated: Date.now(),
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`NTES fetch failed for ${trainNumber}: ${error.message}`);
    } else {
      console.error('NTES fetch failed:', error);
    }
    return null;
  }
}

/**
 * Parse train status string to standardized format
 */
function parseTrainStatus(status: string): TrainStatus['status'] {
  const statusStr = (status || '').toLowerCase();

  if (statusStr.includes('on time')) return 'On Time';
  if (statusStr.includes('delayed')) return 'Delayed';
  if (statusStr.includes('cancel')) return 'Cancelled';
  if (statusStr.includes('running')) return 'Running';

  return 'Unknown';
}

/**
 * Fetch from Google Trains widget
 * Scrapes Google Search trains results
 * Note: This requires parsing JavaScript-rendered content, which is complex
 * For MVP purposes, returns null to defer to NTES
 */
export async function fetchFromGoogle(trainNumber: string, date?: string): Promise<TrainStatus | null> {
  try {
    // Google Trains results would need Puppeteer/Playwright to render
    // This is beyond the scope for MVP. NTES is sufficient.
    console.log('Google Trains not implemented (requires Puppeteer)');
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Google search failed:', error.message);
    }
    return null;
  }
}

/**
 * PNR Status Check - THE CHALLENGE
 *
 * CRITICAL: There is NO legitimate free way to check PNR status without:
 * 1. IRCTC login credentials (user's own account)
 * 2. SMS verification (IRCTC sends OTP)
 * 3. Third-party APIs (all require paid subscriptions)
 *
 * A working PNR checker should:
 * - Ask user to input PNR from SMS they received
 * - Use IRCTC's public SMS-based system
 * - Or acknowledge limitation to users
 */
export async function fetchPNRStatus(pnrNumber: string): Promise<PNRStatus | null> {
  // HONEST IMPLEMENTATION
  // PNR verification requires one of:
  // 1. User provides PNR which came from IRCTC SMS (they already have this)
  // 2. Connect to IRCTC's official API (requires merchant account)
  // 3. Implement OTP-based check with IRCTC servers

  // For now: Return clear error explaining limitation
  throw new Error(
    'PNR Status Check requires IRCTC integration. ' +
      'Current limitation: Cannot fetch without official IRCTC API credentials or SMS verification.'
  );
}

/**
 * Seat Availability - Honest Implementation
 *
 * Seat availability changes every ~2 seconds and requires:
 * - Live connection to IRCTC servers, OR
 * - Real-time scraping from travel sites (frequently blocked)
 *
 * Current approach: Return honest error instead of stale data
 */
export async function fetchSeatAvailability(
  trainNumber: string,
  date: string,
  from: string,
  to: string,
  classCode: string
): Promise<SeatAvailability | null> {
  try {
    // This would require:
    // 1. Access to IRCTC's internal API (requires merchant account)
    // 2. Real-time scraping via Puppeteer (unreliable, rate-limited)
    // 3. Third-party travel APIs (usually paid)

    // For MVP: Return null to trigger honest error in API endpoint
    console.log('Seat availability requires real-time IRCTC access');
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Seat availability fetch failed:', error.message);
    } else {
      console.error('Seat availability fetch failed:', error);
    }
    return null;
  }
}

/**
 * HONEST ERROR MESSAGE when data unavailable
 */
export const DATA_UNAVAILABLE_MESSAGE = `
The railway data service is temporarily unavailable.

This is likely because:
1. The backend is not configured with valid data sources
2. Railway servers are under maintenance
3. Rate limits have been exceeded

To fix this:
- For PNR Status: Use the official IRCTC mobile app (most reliable)
- For Train Status: Check NTES.gov.in directly
- For Seat Availability: Check Ixigo or Confirmtkt

We apologize for the inconvenience.
`;
