import { NextResponse } from 'next/server'
import { FEEDS } from '@/config/feeds.config'
import { BRAND_CONFIGS } from '@/config/brands.config'

export async function GET() {
  // A simple health check to verify we can ping the first RSS feed
  let rssStatus = 'unknown'
  let dbStatus = 'ok' // placeholder
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(FEEDS[0].url, { signal: controller.signal })
    clearTimeout(timeoutId)
    rssStatus = res.ok ? 'connected' : 'degraded'
  } catch (e) {
    rssStatus = 'disconnected'
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      feeds: rssStatus,
      database: dbStatus,
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV
  }, { headers: { 'Cache-Control': 'no-store' } })
}
