'use client'
import { useQuery } from '@tanstack/react-query'
import type { BrandId, NewsItem } from '@/types'

export function useNewsData(brand: BrandId, filter: 'brand' | 'general' = 'brand') {
  return useQuery<NewsItem[]>({
    queryKey: ['news', brand, filter],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/news?brand=${brand}&filter=${filter}`, { signal })
      if (!res.ok) throw new Error('News fetch failed')
      const json = await res.json()
      return json.data || json
    },
    refetchInterval: 120_000,
    staleTime: 0,
  })
}
