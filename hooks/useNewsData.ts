'use client'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import type { BrandId, NewsResponse } from '@/types'

export function useNewsData(brand: BrandId, filter: 'brand' | 'general' = 'brand') {
  const refreshMs = useAppStore((s) => s.refreshMs)
  return useQuery<NewsResponse>({
    queryKey: ['news', brand, filter],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/news?brand=${brand}&filter=${filter}`, { signal })
      if (!res.ok) throw new Error(`News request failed (${res.status})`)
      return res.json()
    },
    refetchInterval: refreshMs,
    staleTime: 60_000,
  })
}
