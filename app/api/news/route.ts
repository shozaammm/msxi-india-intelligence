import { NextRequest, NextResponse } from 'next/server'
import { getNews, type NewsFilter } from '@/lib/news'
import { parseBrand, parseEnum, parseIntClamped } from '@/lib/validate'
import type { NewsResponse } from '@/types'

const FILTERS = ['brand', 'general'] as const
const REGIONS = ['all', 'india', 'global'] as const

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const brand = parseBrand(params.get('brand'))
  const filter = parseEnum<NewsFilter>(params.get('filter'), FILTERS, 'brand')
  const region = parseEnum(params.get('sources'), REGIONS, 'all')
  if (!brand || !filter || !region) {
    return NextResponse.json({ error: 'Invalid brand, filter or sources parameter' }, { status: 400 })
  }
  const page = parseIntClamped(params.get('page'), 1, 1, 50)
  const limit = parseIntClamped(params.get('limit'), 150, 1, 150)

  const result = await getNews(brand, filter)
  const items = region === 'all' ? result.items : result.items.filter((i) => i.region === region)
  const start = (page - 1) * limit

  const body: NewsResponse = {
    data: items.slice(start, start + limit),
    pagination: { page, limit, total: items.length, totalPages: Math.max(1, Math.ceil(items.length / limit)) },
    meta: { fetchedAt: result.fetchedAt, stale: result.stale, feedsOk: result.feedsOk, feedsTotal: result.feedsTotal },
  }
  // CDN absorbs repeat traffic, so publishers see at most one fetch per feed per few minutes.
  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' },
  })
}
