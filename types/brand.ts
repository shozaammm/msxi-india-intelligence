export type BrandId = 'mercedes' | 'bmw'

export interface BrandConfig {
  id: BrandId
  name: string
  fullName: string
  ticker: string
  exchange: string
  accentColor: string
  pillTextColor: string
  pillBgColor: string
  pillBorderColor: string
  newsKeywords: string[]
}
