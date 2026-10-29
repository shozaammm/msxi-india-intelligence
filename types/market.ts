import type { BrandId } from './brand'

export interface SalesMonth {
  month: string
  units: number
  yoyGrowth: number
}

export interface BestState {
  stateName: string
  registrationCount: number
  marketSharePct: number
  yoyGrowthPct: number
}

export interface YoutubeReview {
  channel: string
  reviewer: string
  quote: string
  rating: string
  videoTitle: string
  videoUrl: string
}

export interface CultureEvent {
  name: string
  location: string
  description: string
}

export interface MarketData {
  brand: BrandId
  ticker: string
  // Live stock-derived (dynamic)
  marketCap: number
  eurinr: number
  timestamp: number
  
  // Indian Subsidiary Performance
  monthlySalesUnits: number
  monthlySalesTrend: SalesMonth[]
  annualSalesVolume: number
  yoyGrowthPct: number
  luxurySegmentShare: number
  
  // Best Performing States
  topStates: BestState[]
  
  // User Reviews & Sentiment
  userRating: number
  totalUserReviews: number
  userSentimentPositives: string[]
  userSentimentNegatives: string[]
  
  // YouTube Reviews
  youtubeReviews: YoutubeReview[]
  
  // Car Culture
  carCulture: {
    enthusiastIndex: number
    officialClubs: string[]
    majorEvents: CultureEvent[]
    cultureHighlight: string
  }
}

export interface MarketplaceData {
  brand: BrandId
  totalListings: number
  avgPrice: number
  daysOnMarket: number
  vahanRegistrations: number
  vahanMonth: string
  regions: { name: string; count: number; pct: number }[]
  topModels: { name: string; price: string }[]
}
