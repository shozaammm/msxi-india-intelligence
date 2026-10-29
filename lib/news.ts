import { fetchAndParseRSS } from '@/lib/rssParser'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { FEEDS, googleNewsFeed } from '@/config/feeds.config'
import type { BrandId, NewsItem } from '@/types'

export type NewsFilter = 'brand' | 'general'

const CACHE_TTL_MS = 5 * 60_000
const MAX_ITEMS = 150
// Keyed only by validated brand × filter, so the map can't grow from user input.
const cache = new Map<string, { items: NewsItem[]; ts: number; feedsOk: number; feedsTotal: number }>()

export interface AggregateResult {
  items: NewsItem[]
  fetchedAt: string
  stale: boolean
  feedsOk: number
  feedsTotal: number
}

export async function getNews(brand: BrandId, filter: NewsFilter): Promise<AggregateResult> {
  const key = `${brand}:${filter}`
  const cached = cache.get(key)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return { items: cached.items, fetchedAt: new Date(cached.ts).toISOString(), stale: false, feedsOk: cached.feedsOk, feedsTotal: cached.feedsTotal }
  }

  const config = BRAND_CONFIGS[brand]
  const keywords = filter === 'brand' ? config.newsKeywords : []
  const perFeed = filter === 'brand' ? 15 : 20
  const jobs = FEEDS.map((f) => fetchAndParseRSS(f.url, { ...f, keywords, maxItems: perFeed }))
  if (filter === 'brand') {
    const g = googleNewsFeed(config.googleNewsQuery)
    jobs.push(fetchAndParseRSS(g.url, { ...g, keywords: [], maxItems: 30 }))
  }

  const results = await Promise.all(jobs)
  const feedsOk = results.filter((r) => r.ok).length
  const seenIds = new Set<string>()
  const seenHeadlines = new Set<string>()
  const items = results
    .flatMap((r) => r.items)
    .sort((a, b) => b.isoTimestamp.localeCompare(a.isoTimestamp))
    .filter((item) => {
      // Same story syndicated across outlets: keep the newest copy.
      const h = item.headline.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 60)
      if (seenIds.has(item.id) || seenHeadlines.has(h)) return false
      seenIds.add(item.id)
      seenHeadlines.add(h)
      return true
    })
    .slice(0, MAX_ITEMS)

  if (items.length === 0 && cached) {
    // Every feed failed: serve the last good set and say so.
    return { items: cached.items, fetchedAt: new Date(cached.ts).toISOString(), stale: true, feedsOk, feedsTotal: jobs.length }
  }
  cache.set(key, { items, ts: Date.now(), feedsOk, feedsTotal: jobs.length })
  return { items, fetchedAt: new Date().toISOString(), stale: false, feedsOk, feedsTotal: jobs.length }
}
