'use client'
import { useQuery } from '@tanstack/react-query'
import type { BrandId, MarketData } from '@/types'

export function useMarketData(brand: BrandId) {
  return useQuery<MarketData>({
    queryKey: ['market', brand],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/market?brand=${brand}`, { signal })
      if (!res.ok) throw new Error('Market data fetch failed')
      return res.json()
    },
    refetchInterval: 30_000,
    staleTime: 0,
  })
}
