import { NextResponse } from 'next/server'
import { BRAND_TELEMETRY } from '@/config/telemetry.config'

export async function GET() {
  return NextResponse.json({
    mercedes: {
      salesUnits: BRAND_TELEMETRY.mercedes.monthlySalesUnits,
      yoyGrowthPct: BRAND_TELEMETRY.mercedes.yoyGrowthPct,
      luxurySegmentShare: BRAND_TELEMETRY.mercedes.luxurySegmentShare,
      userRating: BRAND_TELEMETRY.mercedes.userRating,
    },
    bmw: {
      salesUnits: BRAND_TELEMETRY.bmw.monthlySalesUnits,
      yoyGrowthPct: BRAND_TELEMETRY.bmw.yoyGrowthPct,
      luxurySegmentShare: BRAND_TELEMETRY.bmw.luxurySegmentShare,
      userRating: BRAND_TELEMETRY.bmw.userRating,
    }
  }, { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } })
}
