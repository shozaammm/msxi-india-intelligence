import type { BrandId, BrandIntel } from '@/types'

// India figures for each brand, each with its source and status.
//
// HOW TO UPDATE (monthly, ~15 min): when FADA publishes its retail release
// (around the 6th), copy the brand's units into `monthlyTrend`, set status to
// 'reported', sourceUrl to the PDF and asOf to the month. Never type a number
// that isn't in a cited source; leave it as 'sample' until you have one.
// See /methodology in the app for the full process.

const SAMPLE_NOTE = 'Illustrative placeholder until the FADA / VAHAN pipeline is connected. Not real data.'

export const BRAND_INTEL: Record<BrandId, BrandIntel> = {
  mercedes: {
    brand: 'mercedes',
    annualSales: {
      value: { year: 2025, units: 19_007, yoyPct: -3, scope: 'Mercedes-Benz India (incl. AMG, Maybach)' },
      status: 'reported',
      source: 'Business Today, citing Mercedes-Benz India',
      sourceUrl: 'https://www.businesstoday.in/amp/auto/story/mercedes-benz-india-sees-3-drop-in-sales-as-entry-luxury-portfolio-shrinks-511066-2026-01-15',
      asOf: '2025-12-31',
    },
    monthlyTrend: {
      value: [
        { month: 'Dec 2025', units: 1620 },
        { month: 'Jan 2026', units: 1350 },
        { month: 'Feb 2026', units: 1410 },
        { month: 'Mar 2026', units: 1720 },
        { month: 'Apr 2026', units: 1390 },
        { month: 'May 2026', units: 1480 },
      ],
      status: 'sample',
      source: 'Sample data',
      asOf: '2026-05-31',
      note: SAMPLE_NOTE,
    },
    segmentShare: { value: 48.5, status: 'sample', source: 'Sample data', asOf: '2026-05-31', note: SAMPLE_NOTE },
    topStates: {
      value: [
        { stateName: 'Maharashtra', registrationCount: 480, marketSharePct: 32.4 },
        { stateName: 'Delhi NCR', registrationCount: 360, marketSharePct: 24.3 },
        { stateName: 'Karnataka', registrationCount: 265, marketSharePct: 17.9 },
        { stateName: 'Tamil Nadu', registrationCount: 160, marketSharePct: 10.8 },
        { stateName: 'Telangana', registrationCount: 120, marketSharePct: 8.1 },
      ],
      status: 'sample',
      source: 'Sample data',
      asOf: '2026-05-31',
      note: SAMPLE_NOTE,
    },
    sharesOutstanding: {
      value: 1_070_000_000,
      status: 'sample',
      source: 'Approximate; verify against the latest Mercedes-Benz Group annual report',
      sourceUrl: 'https://group.mercedes-benz.com/investors/',
      asOf: '2026-05-25',
      note: 'Share buybacks change this figure. Market cap is approximate until it is verified.',
    },
  },
  bmw: {
    brand: 'bmw',
    annualSales: {
      value: { year: 2025, units: 18_001, yoyPct: 14, scope: 'BMW Group India (BMW 17,271 + MINI 730)' },
      status: 'reported',
      source: 'BMW Group PressClub India',
      sourceUrl: 'https://www.press.bmwgroup.com/india/article/detail/T0454848EN/unstoppable-high-performance-drive-bmw-group-india-delivers-record-breaking-annual-sales-with-high',
      asOf: '2025-12-31',
    },
    monthlyTrend: {
      value: [
        { month: 'Dec 2025', units: 1390 },
        { month: 'Jan 2026', units: 1180 },
        { month: 'Feb 2026', units: 1220 },
        { month: 'Mar 2026', units: 1490 },
        { month: 'Apr 2026', units: 1190 },
        { month: 'May 2026', units: 1290 },
      ],
      status: 'sample',
      source: 'Sample data',
      asOf: '2026-05-31',
      note: SAMPLE_NOTE,
    },
    segmentShare: { value: 40.2, status: 'sample', source: 'Sample data', asOf: '2026-05-31', note: SAMPLE_NOTE },
    topStates: {
      value: [
        { stateName: 'Maharashtra', registrationCount: 385, marketSharePct: 29.8 },
        { stateName: 'Delhi NCR', registrationCount: 315, marketSharePct: 24.4 },
        { stateName: 'Karnataka', registrationCount: 245, marketSharePct: 19.0 },
        { stateName: 'Tamil Nadu', registrationCount: 142, marketSharePct: 11.0 },
        { stateName: 'Telangana', registrationCount: 108, marketSharePct: 8.4 },
      ],
      status: 'sample',
      source: 'Sample data',
      asOf: '2026-05-31',
      note: SAMPLE_NOTE,
    },
    sharesOutstanding: {
      value: 601_995_196,
      status: 'sample',
      source: 'Approximate; verify against the latest BMW Group annual report',
      sourceUrl: 'https://www.bmwgroup.com/en/investor-relations.html',
      asOf: '2026-05-25',
      note: 'Includes ordinary and preferred shares only if the report says so. Market cap is approximate until it is verified.',
    },
  },
}
