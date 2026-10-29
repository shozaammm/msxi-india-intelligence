export interface NewsItem {
  id: string
  headline: string
  source: string
  sourceColor: 'amber' | 'green' | 'blue' | 'gold' | 'red'
  isoTimestamp: string
  snippet: string
  url: string
}
