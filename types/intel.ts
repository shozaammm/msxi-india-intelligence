import type { BrandId } from './brand'

/**
 * Every number on screen carries one of these.
 * - live:        fetched from an external source within its refresh window
 * - reported:    copied by hand from a public, cited source (press release, FADA PDF)
 * - sample:      illustrative placeholder, NOT real data; must be shown with a Sample badge
 * - stale:       last good value, older than its refresh window
 * - unavailable: source not configured or failing; show nothing rather than a guess
 */
export type DataStatus = 'live' | 'reported' | 'sample' | 'stale' | 'unavailable'

export interface Provenance {
  status: DataStatus
  source: string
  sourceUrl?: string
  /** ISO date the figure refers to or was fetched. */
  asOf: string
  note?: string
}

export interface Sourced<T> extends Provenance {
  value: T
}

export interface SalesMonth {
  month: string
  units: number
}

export interface StateRegistration {
  stateName: string
  registrationCount: number
  marketSharePct: number
}

export interface AnnualSales {
  year: number
  units: number
  yoyPct: number
  scope: string
  /** Label when the period isn't a calendar year, e.g. 'FY2024-25 (Apr–Mar)'. */
  period?: string
  /** Comparison label for yoyPct when not `year - 1`, e.g. 'FY2023-24'. */
  vsLabel?: string
}

export interface BrandIntel {
  brand: BrandId
  annualSales: Sourced<AnnualSales>
  monthlyTrend: Sourced<SalesMonth[]>
  segmentShare: Sourced<number>
  topStates: Sourced<StateRegistration[]>
  sharesOutstanding: Sourced<number>
}
