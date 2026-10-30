import type { BrandId, BrandIntel } from '@/types'

// India figures for each brand, each with its source and status.
//
// HOW TO UPDATE (monthly, ~15 min): when FADA publishes its retail release
// (around the 6th), copy the brand's units into `monthlyTrend`, set status to
// 'reported', sourceUrl to the PDF and asOf to the month. Never type a number
// that isn't in a cited source; leave it as 'sample' until you have one.
// See /methodology in the app for the full process.

const SAMPLE_NOTE = 'Illustrative placeholder until the FADA / VAHAN pipeline is connected. Not real data.'

const NO_MONTHLY: BrandIntel['monthlyTrend'] = { value: [], status: 'unavailable', source: 'No brand-wise monthly figures loaded yet', asOf: '2026-10-30', note: 'FADA publishes brand-wise retail each month. Add it here when available.' }
const NO_STATES: BrandIntel['topStates'] = { value: [], status: 'unavailable', source: 'Needs the VAHAN pipeline', asOf: '2026-10-30', note: 'No state-wise data is loaded for this brand.' }
const NO_SEGMENT: BrandIntel['segmentShare'] = { value: 0, status: 'unavailable', source: 'Not loaded', asOf: '2026-10-30' }
const NO_SHARES: BrandIntel['sharesOutstanding'] = { value: 0, status: 'unavailable', source: 'Not loaded; verify against the parent company annual report', asOf: '2026-10-30' }

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
  audi: {
    brand: 'audi',
    annualSales: {
      value: { year: 2025, units: 4_510, yoyPct: -22, scope: 'Audi India retail sales (customer deliveries)' },
      status: 'reported',
      source: 'Audi India press release, via Rushlane',
      sourceUrl: 'https://www.rushlane.com/audi-india-2025-sales-decline-12537555.html',
      asOf: '2025-12-31',
      note: '2024 was 5,816 units, so the fall is about 22.5%.',
    },
    monthlyTrend: NO_MONTHLY,
    segmentShare: NO_SEGMENT,
    topStates: NO_STATES,
    sharesOutstanding: NO_SHARES,
  },
  volvo: {
    brand: 'volvo',
    annualSales: {
      value: { year: 2023, units: 2_423, yoyPct: 31, scope: 'Volvo Car India, calendar 2023' },
      status: 'reported',
      source: 'Business Standard, citing Volvo Car India',
      sourceUrl: 'https://www.business-standard.com/topic/volvo-cars',
      asOf: '2023-12-31',
      note: 'Latest India full-year figure we could find. Volvo has not been matched to a 2024 or 2025 release; replace this when you find one.',
    },
    monthlyTrend: NO_MONTHLY,
    segmentShare: NO_SEGMENT,
    topStates: NO_STATES,
    sharesOutstanding: NO_SHARES,
  },
  porsche: {
    brand: 'porsche',
    annualSales: {
      value: { year: 2024, units: 1_006, yoyPct: 10, scope: 'Porsche India deliveries, calendar 2024' },
      status: 'reported',
      source: 'Porsche Newsroom',
      sourceUrl: 'https://newsroom.porsche.com/en_PME/2025/company/porsche-india-achieves-new-sales-milestone.html',
      asOf: '2024-12-31',
      note: 'Latest India full-year figure we could find. A calendar 2025 India number was not located; replace this when it is published.',
    },
    monthlyTrend: NO_MONTHLY,
    segmentShare: NO_SEGMENT,
    topStates: NO_STATES,
    sharesOutstanding: NO_SHARES,
  },
  landrover: {
    brand: 'landrover',
    annualSales: {
      value: { year: 2025, units: 6_183, yoyPct: 40, scope: 'JLR India retail (Jaguar and Land Rover together)', period: 'FY2024-25 (Apr to Mar)', vsLabel: 'FY2023-24' },
      status: 'reported',
      source: 'Autocar Pro, citing JLR India',
      sourceUrl: 'https://autocarpro.in/news/jlr-india-records-highest-annual-sales-with-growth-of-40-in-fy25-125828',
      asOf: '2025-03-31',
      note: 'JLR reports on a fiscal year and does not split Land Rover from Jaguar in India. A calendar 2025 figure was not located.',
    },
    monthlyTrend: NO_MONTHLY,
    segmentShare: NO_SEGMENT,
    topStates: NO_STATES,
    sharesOutstanding: NO_SHARES,
  },
  lexus: {
    brand: 'lexus',
    annualSales: {
      value: { year: 2025, units: 0, yoyPct: 0, scope: 'Lexus India has not published unit totals' },
      status: 'unavailable',
      source: 'AutoGuide India, citing Lexus India',
      sourceUrl: 'https://www.autoguideindia.com/statistics/lexus-india-cy2025-ultra-luxury-sales-growth/',
      asOf: '2025-12-31',
      note: 'Lexus India reported growth rates and model mix for 2025 (LM and LX about +50%, roughly 19% of sales), not unit totals. We show nothing rather than an estimate.',
    },
    monthlyTrend: NO_MONTHLY,
    segmentShare: NO_SEGMENT,
    topStates: NO_STATES,
    sharesOutstanding: NO_SHARES,
  },
}
