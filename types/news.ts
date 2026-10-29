export type SourceColor = 'amber' | 'green' | 'blue' | 'gold' | 'red'
export type FeedRegion = 'india' | 'global'

export interface NewsItem {
  id: string
  headline: string
  source: string
  sourceColor: SourceColor
  region: FeedRegion
  isoTimestamp: string
  /** True when the feed gave no usable date and fetch time was used instead. */
  dateEstimated?: boolean
  snippet: string
  url: string
  topics: string[]
}

export interface NewsMeta {
  fetchedAt: string
  /** True when every feed failed and these are older cached items. */
  stale: boolean
  feedsOk: number
  feedsTotal: number
}

export interface NewsResponse {
  data: NewsItem[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
  meta: NewsMeta
}
