export type BrandId = 'mercedes' | 'bmw'

export interface BrandLink {
  label: string
  url: string
}

export interface BrandConfig {
  id: BrandId
  name: string
  fullName: string
  ticker: string
  /** Ticker as the market-data provider expects it (Twelve Data symbol + exchange). */
  providerSymbol: { symbol: string; exchange: string }
  exchange: string
  accentColor: string
  logo: string
  /** Optional secondary mark shown next to the wordmark (e.g. AMG). */
  subLogo?: string
  pillTextColor: string
  pillBgColor: string
  pillBorderColor: string
  /** Terms that identify the brand itself. One match is enough to include a story. */
  newsKeywords: string[]
  /** Google News search query, scoped to India. */
  googleNewsQuery: string
  /** Models to link to on YouTube review search. No quotes are stored, only links out. */
  reviewModels: string[]
  officialLinks: BrandLink[]
}
