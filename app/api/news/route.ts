import { NextRequest, NextResponse } from 'next/server'
import { fetchAndParseRSS } from '@/lib/rssParser'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { FEEDS } from '@/config/feeds.config'
import type { BrandId, NewsItem } from '@/types'

const CACHE = new Map<string, { items: NewsItem[]; ts: number }>()
const CACHE_TTL = 60_000

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const brand = (url.searchParams.get('brand') ?? 'mercedes') as BrandId
  const filter = url.searchParams.get('filter') ?? 'brand' // 'brand' or 'general'
  const page = parseInt(url.searchParams.get('page') ?? '1', 10)
  const limit = parseInt(url.searchParams.get('limit') ?? '20', 10)
  const sources = url.searchParams.get('sources') // 'india' or 'global' or 'all'
  
  const config = BRAND_CONFIGS[brand]

  let items: NewsItem[] = []
  const cacheKey = `${brand}-${filter}`
  const cached = CACHE.get(cacheKey)
  
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    items = cached.items
  } else {
    const activeKeywords = filter === 'brand' ? config.newsKeywords : []
    const results = await Promise.allSettled(
      FEEDS.map((f) => fetchAndParseRSS(f.url, f.source, f.color, activeKeywords, filter === 'brand' ? 12 : 20))
    )
    items = results
      .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      .sort((a, b) => new Date(b.isoTimestamp).getTime() - new Date(a.isoTimestamp).getTime())
      .filter((item, idx, arr) => arr.findIndex(i => i.headline.toLowerCase().slice(0, 50) === item.headline.toLowerCase().slice(0, 50)) === idx)
      .slice(0, 150)
    
    if (items.length > 0) {
      CACHE.set(cacheKey, { items, ts: Date.now() })
    }
  }

  // Apply source filtering
  if (sources && sources !== 'all') {
    const regionFeeds = new Set(FEEDS.filter(f => f.region === sources).map(f => f.source))
    items = items.filter(item => regionFeeds.has(item.source))
  }

  // Apply pagination
  const startIndex = (page - 1) * limit
  const paginatedItems = items.slice(startIndex, startIndex + limit)

  if (paginatedItems.length === 0 && page === 1) {
    return NextResponse.json([{
      id: 'fb-1',
      headline: `${config.name} Intelligence — Live feed connecting…`,
      source: 'MSXI Feed Engine',
      sourceColor: 'gold',
      isoTimestamp: new Date().toISOString(),
      snippet: 'RSS feeds are initialising. Data will appear shortly.',
      url: '#',
    }], { headers: { 'Cache-Control': 'no-store' } })
  }

  return NextResponse.json({
    data: paginatedItems,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit)
    }
  }, { headers: { 'Cache-Control': 'no-store' } })
}
