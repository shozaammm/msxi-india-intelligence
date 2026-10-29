import { NextRequest, NextResponse } from 'next/server'
import { getMarketSnapshot } from '@/lib/market'
import { parseBrand } from '@/lib/validate'

export async function GET(req: NextRequest) {
  const brand = parseBrand(req.nextUrl.searchParams.get('brand'))
  if (!brand) return NextResponse.json({ error: 'Unknown brand' }, { status: 400 })

  const snapshot = await getMarketSnapshot(brand)
  return NextResponse.json(snapshot, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
