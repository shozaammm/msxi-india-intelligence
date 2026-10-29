import { NextRequest, NextResponse } from 'next/server'
import type { MarketData, BrandId } from '@/types'
import { BRAND_TELEMETRY } from '@/config/telemetry.config'

const YF_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://finance.yahoo.com/',
}

const SHARES: Record<string, number> = {
  'MBG.DE': 1_070_000_000,
  'BMW.DE':   601_995_196,
}

const CACHE = new Map<string, { data: Partial<MarketData>; ts: number }>()
const CACHE_TTL = 30_000

async function fromYahoo(ticker: string): Promise<{ marketCap: number; eurinr: number } | null> {
  for (const base of ['https://query1.finance.yahoo.com', 'https://query2.finance.yahoo.com']) {
    try {
      const res = await fetch(
        `${base}/v8/finance/chart/${ticker}?interval=1d&range=1d&includePrePost=false`,
        { headers: YF_HEADERS, signal: AbortSignal.timeout(6000) },
      )
      if (res.status === 429) return null
      if (!res.ok) continue
      const json = await res.json()
      const result = json?.chart?.result?.[0]
      if (!result) continue

      const price = result.meta.regularMarketPrice ?? 0
      if (!price || isNaN(price)) continue

      let eurinr = 91.5
      try {
        const fx = await fetch(`${base}/v8/finance/chart/EURINR%3DX?interval=1d&range=1d`, { headers: YF_HEADERS, signal: AbortSignal.timeout(4000) })
        if (fx.ok) {
          const fj = await fx.json()
          eurinr = fj?.chart?.result?.[0]?.meta?.regularMarketPrice ?? 91.5
        }
      } catch { /* use fallback */ }

      if (isNaN(eurinr)) eurinr = 91.5

      return { marketCap: (SHARES[ticker] ?? 0) * price, eurinr }
    } catch { continue }
  }
  return null
}

async function fromStooq(ticker: string): Promise<{ marketCap: number; eurinr: number } | null> {
  try {
    const stooqTicker = ticker.replace('.', '.').toLowerCase()
    const res = await fetch(`https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqTicker)}&i=d`, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return null
    const csv = await res.text()
    const lines = csv.trim().split('\n').filter(l => !l.startsWith('Date'))
    if (!lines.length) return null

    const price = +(lines[0].split(',')[4])
    if (isNaN(price)) return null

    let eurinr = 91.5
    try {
      const fxRes = await fetch('https://stooq.com/q/d/l/?s=eurinr&i=d', { signal: AbortSignal.timeout(4000) })
      if (fxRes.ok) {
        const fxCsv = await fxRes.text()
        const fxLines = fxCsv.trim().split('\n').filter(l => !l.startsWith('Date'))
        if (fxLines.length) {
          const fxPrice = +(fxLines[0].split(',')[4])
          if (!isNaN(fxPrice)) {
            eurinr = fxPrice
          }
        }
      }
    } catch { /* fallback */ }

    return { marketCap: (SHARES[ticker] ?? 0) * price, eurinr }
  } catch { return null }
}

export async function GET(req: NextRequest) {
  const brandParam = req.nextUrl.searchParams.get('brand') as BrandId | null
  const tickerParam = req.nextUrl.searchParams.get('ticker') as string | null

  const brand = (brandParam === 'bmw' || tickerParam === 'BMW.DE') ? 'bmw' : 'mercedes'
  const ticker = brand === 'mercedes' ? 'MBG.DE' : 'BMW.DE'

  const cached = CACHE.get(ticker)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data, { headers: { 'Cache-Control': 'no-store' } })
  }

  const liveStock = (await fromYahoo(ticker)) ?? (await fromStooq(ticker))
  const finalMarketCap = liveStock ? liveStock.marketCap : (SHARES[ticker] * (brand === 'mercedes' ? 66.5 : 82.5))
  const finalEurInr = liveStock ? liveStock.eurinr : 91.5

  const telemetry = BRAND_TELEMETRY[brand]
  
  const data: Partial<MarketData> = {
    brand,
    ticker,
    marketCap: finalMarketCap,
    eurinr: finalEurInr,
    timestamp: Date.now(),
    monthlySalesUnits: telemetry.monthlySalesUnits,
    monthlySalesTrend: telemetry.monthlySalesTrend,
    annualSalesVolume: telemetry.annualSalesVolume,
    yoyGrowthPct: telemetry.yoyGrowthPct,
    luxurySegmentShare: telemetry.luxurySegmentShare,
    // Add legacy fields for compatibility during transition
    topStates: telemetry.topStates,
    userRating: telemetry.userRating,
    totalUserReviews: telemetry.totalUserReviews,
    userSentimentPositives: telemetry.userSentimentPositives,
    userSentimentNegatives: telemetry.userSentimentNegatives,
    youtubeReviews: telemetry.youtubeReviews,
    carCulture: telemetry.carCulture,
  }

  CACHE.set(ticker, { data, ts: Date.now() })
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
