'use client'
import { useQuery } from '@tanstack/react-query'
import type { BrandId, MarketSnapshot } from '@/types'

export function useMarketData(brand: BrandId) {
  return useQuery<MarketSnapshot>({
    queryKey: ['market', brand],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/market?brand=${brand}`, { signal })
      if (!res.ok) throw new Error(`Market data request failed (${res.status})`)
      return res.json()
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}
