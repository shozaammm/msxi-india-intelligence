import { NextRequest, NextResponse } from 'next/server'
import type { BrandId } from '@/types'
import { BRAND_TELEMETRY } from '@/config/telemetry.config'

export async function GET(req: NextRequest) {
  const brand = (req.nextUrl.searchParams.get('brand') ?? 'mercedes') as BrandId
  const telemetry = BRAND_TELEMETRY[brand]
  
  if (!telemetry) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  return NextResponse.json({
    brand,
    userRating: telemetry.userRating,
    totalUserReviews: telemetry.totalUserReviews,
    userSentimentPositives: telemetry.userSentimentPositives,
    userSentimentNegatives: telemetry.userSentimentNegatives,
    youtubeReviews: telemetry.youtubeReviews,
  }, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } })
}
