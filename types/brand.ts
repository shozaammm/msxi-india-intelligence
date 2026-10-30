export type BrandId = 'mercedes' | 'bmw' | 'audi' | 'volvo' | 'porsche' | 'landrover' | 'lexus'

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
  /** Default surface when the user hasn't picked one. */
  theme: 'light' | 'dark'
  /** Short label for the brand switcher pill. */
  switchLabel: string
  /** Optional: brands without a licensed mark fall back to a monogram. */
  logo?: string
  /** Single-colour (black) mark: inverted wherever it sits on a dark surface. */
  logoMono?: boolean
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
