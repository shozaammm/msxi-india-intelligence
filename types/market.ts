import type { BrandId } from './brand'
import type { Provenance, Sourced } from './intel'

export interface Quote extends Provenance {
  price: number
  changePct: number | null
  currency: string
}

export interface MarketSnapshot {
  brand: BrandId
  ticker: string
  exchange: string
  /** EUR → INR reference rate. */
  fx: Sourced<number> | null
  /** Null when no licensed market-data provider is configured or it failed. */
  quote: Quote | null
  /** price × shares outstanding, in EUR. Null when there is no quote. */
  marketCapEUR: number | null
  sharesOutstanding: Sourced<number>
  providerConfigured: boolean
  fetchedAt: string
}
