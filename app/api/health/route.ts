import { NextResponse } from 'next/server'
import { getFeedHealth } from '@/lib/feedHealth'
import { getNews } from '@/lib/news'

export async function GET() {
  // Populates feed health if this instance hasn't fetched yet.
  const news = await getNews('mercedes', 'brand')
  const feeds = getFeedHealth()
  const failing = feeds.filter((f) => !f.ok)
  const status = news.feedsOk === 0 ? 'down' : failing.length / Math.max(1, feeds.length) > 0.3 ? 'degraded' : 'ok'

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      services: {
        feeds: { ok: feeds.length - failing.length, total: feeds.length },
        marketData: process.env.TWELVE_DATA_API_KEY ? 'configured' : 'not configured',
        storage: 'none (in-memory cache only)',
      },
      feeds,
    },
    { status: status === 'down' ? 503 : 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
