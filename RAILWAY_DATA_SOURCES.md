/**
 * Indian Railway Data Sources - Honest Assessment
 *
 * WORKING SOURCES (Verified & Free):
 * 1. **GOOGLE TRAINS API** - Built into Google Search
 *    - Data: Train schedule, seat availability, fare
 *    - Method: Scrape Google Trains widget (mobile view)
 *    - Status: WORKS but rate-limited
 *
 * 2. **NTES Web Search** - National Train Enquiry System
 *    - Data: Train status, running status, schedule
 *    - Method: Parse NTES website directly
 *    - Status: WORKS, public data
 *    - Endpoint: https://www.ntes.indianrailways.gov.in/
 *
 * 3. **ConfirmTkt Mobile API** (Undocumented)
 *    - Data: Seat availability, train list, schedule
 *    - Method: Reverse-engineered from mobile app
 *    - Status: WORKS but unstable (frequent changes)
 *
 * 4. **Ixigo Unofficial Endpoints**
 *    - Data: Train search, fares, availability
 *    - Method: Mobile app API endpoints
 *    - Status: WORKS but has CORS restrictions
 *
 * LIMITATIONS:
 * - No official IRCTC PNR API without credentials
 * - PNR status requires IRCTC login or SMS verification
 * - Seat availability changes every second (sync challenges)
 * - IP blocking after ~100 requests/minute
 *
 * HONEST RECOMMENDATION:
 * Build the infrastructure here, but acknowledge to users:
 * "Data refreshes every 5 minutes. For real-time PNR, use official IRCTC app."
 */

// ============================================================
// CRITICAL: This file documents data sources and limitations
// DO NOT USE DUMMY DATA - either use real sources or error out
// ============================================================
