import type { BrandId } from '@/types'

// Unit sales by period and by model, every row copied from a cited public source.
// Never type a number that is not in the source. If a brand or period is missing,
// leave it out: the UI shows "not published" rather than a guess.
//
// HOW TO UPDATE: when a new period is published, add its id to PERIODS, then a block
// to BRAND_SALES (and MODEL_SALES if model-wise units are published).

export type PeriodId = 'cy2025' | 'fy2026' | 'ytd2026' | 'h12026' | 'q32026' | 'q12026' | 'jan2026' | 'feb2026' | 'mar2026'
export type PeriodGroup = 'year' | 'fy' | 'ytd' | 'half' | 'quarter' | 'month'

export interface Period {
  id: PeriodId
  group: PeriodGroup
  label: string
  /** Full description of the span. */
  span: string
}

export const PERIOD_GROUPS: { id: PeriodGroup; label: string }[] = [
  { id: 'year', label: 'Calendar year' },
  { id: 'fy', label: 'Financial year' },
  { id: 'ytd', label: 'So far this year' },
  { id: 'half', label: 'Half year' },
  { id: 'quarter', label: 'Quarter' },
  { id: 'month', label: 'Month' },
]

export const PERIODS: Period[] = [
  { id: 'cy2025', group: 'year', label: '2025', span: 'Calendar 2025 (Jan to Dec)' },
  { id: 'fy2026', group: 'fy', label: 'FY2026', span: 'Financial year 2025-26 (Apr to Mar)' },
  { id: 'ytd2026', group: 'ytd', label: 'Jan to Sep 2026', span: 'January to September 2026' },
  { id: 'h12026', group: 'half', label: 'H1 2026', span: 'January to June 2026' },
  { id: 'q32026', group: 'quarter', label: 'Q3 2026', span: 'July to September 2026' },
  { id: 'q12026', group: 'quarter', label: 'Q1 2026', span: 'January to March 2026' },
  { id: 'mar2026', group: 'month', label: 'Mar 2026', span: 'March 2026' },
  { id: 'feb2026', group: 'month', label: 'Feb 2026', span: 'February 2026' },
  { id: 'jan2026', group: 'month', label: 'Jan 2026', span: 'January 2026' },
]

/** How the units were counted. Retail (VAHAN) and company-reported totals differ for the same brand. */
export type Basis = 'vahan' | 'company' | 'mixed'

export const BASIS_LABEL: Record<Basis, string> = {
  vahan: 'VAHAN registrations',
  company: 'Company-reported',
  mixed: 'Company-reported and VAHAN',
}

export interface BrandFigure {
  brand: BrandId
  units: number
  /** Same period a year earlier, when the source prints it. */
  prior?: number
  /** Printed YoY when the source gives only the percentage. */
  yoyPct?: number
  note?: string
}

export interface PeriodSales {
  basis: Basis
  source: string
  sourceUrl: string
  asOf: string
  note?: string
  rows: BrandFigure[]
}

const RUSHLANE_Q1 = 'https://www.rushlane.com/bmw-india-leads-luxury-car-retail-sales-in-q1-2026-vahan-data-12543452.html'
const IBEF_YTD = 'https://www.ibef.org/news/india-luxury-car-sales-rise-in-double-digits-mercedes-benz-sales-grow-8-to-record-15-190-units'

export const BRAND_SALES: Partial<Record<PeriodId, PeriodSales>> = {
  cy2025: {
    basis: 'vahan',
    source: 'Rushlane, from VAHAN and Telangana Open Data',
    sourceUrl: 'https://www.rushlane.com/top-20-luxury-cars-sales-2025-india-e-class-gle-ix1-x1-12545423.html',
    asOf: '2025-12-31',
    note: 'Retail registrations, so totals differ slightly from company-reported figures. Land Rover row is Jaguar Land Rover. Porsche and Lexus are not in this source.',
    rows: [
      { brand: 'mercedes', units: 19_282 },
      { brand: 'bmw', units: 17_730 },
      { brand: 'landrover', units: 5_979 },
      { brand: 'audi', units: 4_777 },
      { brand: 'volvo', units: 1_736 },
    ],
  },
  fy2026: {
    basis: 'company',
    source: 'Autocar India, from OEMs and FADA',
    sourceUrl: 'https://www.autocarindia.com/industry/bmw-surpasses-mercedes-benz-in-q4-fy2026-luxury-car-sales-439398',
    asOf: '2026-03-31',
    note: 'Audi is left out: the source lists only 248 units for Audi (fully imported models), which is not comparable. Land Rover row is JLR. Porsche has no prior-year figure in the source.',
    rows: [
      { brand: 'mercedes', units: 19_363, prior: 18_928 },
      { brand: 'bmw', units: 17_301, prior: 15_114 },
      { brand: 'landrover', units: 5_698, prior: 5_350 },
      { brand: 'volvo', units: 1_647, prior: 1_665 },
      { brand: 'porsche', units: 697 },
    ],
  },
  ytd2026: {
    basis: 'company',
    source: 'IBEF, citing Mercedes-Benz India',
    sourceUrl: IBEF_YTD,
    asOf: '2026-09-30',
    note: 'Only Mercedes-Benz has published January to September 2026 so far.',
    rows: [{ brand: 'mercedes', units: 15_190, prior: 14_132 }],
  },
  h12026: {
    basis: 'mixed',
    source: 'Autocar India (JLR, Audi, Volvo, Lexus, Porsche from VAHAN)',
    sourceUrl: 'https://www.autocarindia.com/car-news-amp/h1-2026-luxury-car-sales-mercedes-benz-remains-in-pole-position-440165',
    asOf: '2026-06-30',
    note: 'AutoPunditz prints different H1 figures for Audi (2,748) and JLR (1,768), so sources disagree here. Autocar India is used because it states which rows are VAHAN.',
    rows: [
      { brand: 'mercedes', units: 9_768, prior: 9_013 },
      { brand: 'bmw', units: 9_075, prior: 7_756 },
      { brand: 'landrover', units: 3_039, prior: 3_199 },
      { brand: 'audi', units: 2_182, prior: 2_118 },
      { brand: 'volvo', units: 874, prior: 840 },
      { brand: 'lexus', units: 759, prior: 737 },
      { brand: 'porsche', units: 319, prior: 409 },
    ],
  },
  q32026: {
    basis: 'company',
    source: 'IBEF, citing Mercedes-Benz India',
    sourceUrl: IBEF_YTD,
    asOf: '2026-09-30',
    note: 'Only Mercedes-Benz has published Q3 2026 so far. Its highest-ever quarter.',
    rows: [{ brand: 'mercedes', units: 5_422, yoyPct: 5.9 }],
  },
  q12026: {
    basis: 'vahan',
    source: 'Rushlane, from VAHAN',
    sourceUrl: RUSHLANE_Q1,
    asOf: '2026-03-31',
    note: 'Retail registrations. Land Rover row is JLR. Audi and Lexus are not in this source.',
    rows: [
      { brand: 'bmw', units: 4_944 },
      { brand: 'mercedes', units: 4_861 },
      { brand: 'landrover', units: 1_470 },
      { brand: 'volvo', units: 438 },
      { brand: 'porsche', units: 147 },
    ],
  },
  jan2026: {
    basis: 'vahan', source: 'Rushlane, from VAHAN', sourceUrl: RUSHLANE_Q1, asOf: '2026-01-31',
    note: 'Only BMW and Mercedes-Benz are broken out by month in this source.',
    rows: [{ brand: 'bmw', units: 2_040 }, { brand: 'mercedes', units: 1_923 }],
  },
  feb2026: {
    basis: 'vahan', source: 'Rushlane, from VAHAN', sourceUrl: RUSHLANE_Q1, asOf: '2026-02-28',
    note: 'Only BMW and Mercedes-Benz are broken out by month in this source.',
    rows: [{ brand: 'mercedes', units: 1_475 }, { brand: 'bmw', units: 1_284 }],
  },
  mar2026: {
    basis: 'vahan', source: 'Rushlane, from VAHAN', sourceUrl: RUSHLANE_Q1, asOf: '2026-03-31',
    note: 'Latest month with a brand-wise breakdown found. Only BMW and Mercedes-Benz are broken out by month.',
    rows: [{ brand: 'bmw', units: 1_620 }, { brand: 'mercedes', units: 1_463 }],
  },
}

export interface ModelFigure {
  brand: BrandId
  /** Display name. */
  name: string
  /** Name used in config/models.config.ts, when it differs. */
  lineupName?: string
  body: 'SUV' | 'Sedan'
  units: number
}

export interface ModelSales {
  basis: Basis
  source: string
  sourceUrl: string
  asOf: string
  note: string
  rows: ModelFigure[]
}

/** Model-wise units are published only for calendar 2025 so far. */
export const MODEL_SALES: Partial<Record<PeriodId, ModelSales>> = {
  cy2025: {
    basis: 'vahan',
    source: 'Rushlane / Team-BHP, from VAHAN',
    sourceUrl: 'https://www.rushlane.com/top-20-luxury-cars-sales-2025-india-e-class-gle-ix1-x1-12545423.html',
    asOf: '2025-12-31',
    note: 'Top-20 luxury list only: a model that is missing is below the cut, not zero. Volvo, Porsche and Lexus have no model in the top 20. BYD Sealion 7 (2,213) is in the source list but is not a tracked brand.',
    rows: [
      { brand: 'mercedes', name: 'E-Class', body: 'Sedan', units: 4_117 },
      { brand: 'mercedes', name: 'GLE', body: 'SUV', units: 2_900 },
      { brand: 'bmw', name: 'iX1', lineupName: 'iX1 LWB', body: 'SUV', units: 2_786 },
      { brand: 'bmw', name: 'X1', body: 'SUV', units: 2_734 },
      { brand: 'mercedes', name: 'GLS', body: 'SUV', units: 2_645 },
      { brand: 'mercedes', name: 'GLC', body: 'SUV', units: 2_631 },
      { brand: 'bmw', name: '5 Series', body: 'Sedan', units: 2_534 },
      { brand: 'landrover', name: 'Defender', body: 'SUV', units: 2_470 },
      { brand: 'bmw', name: '3 Series', body: 'Sedan', units: 2_328 },
      { brand: 'bmw', name: 'X5', body: 'SUV', units: 2_053 },
      { brand: 'mercedes', name: 'GLA', body: 'SUV', units: 1_848 },
      { brand: 'mercedes', name: 'C-Class', body: 'Sedan', units: 1_654 },
      { brand: 'audi', name: 'Q3', body: 'SUV', units: 1_631 },
      { brand: 'bmw', name: 'X7', body: 'SUV', units: 1_536 },
      { brand: 'audi', name: 'A4', body: 'Sedan', units: 1_140 },
    ],
  },
}

/** Mercedes-Benz lead over BMW, in units, by calendar year (Rushlane). */
export const MB_BMW_GAP = {
  source: 'Rushlane, Q1 2026 VAHAN report',
  sourceUrl: RUSHLANE_Q1,
  rows: [
    { year: 2021, gap: 3_006 },
    { year: 2022, gap: 4_554 },
    { year: 2023, gap: 4_105 },
    { year: 2024, gap: 4_553 },
    { year: 2025, gap: 1_736 },
  ],
}
