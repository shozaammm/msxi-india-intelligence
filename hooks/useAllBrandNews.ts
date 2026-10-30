'use client'
import { useQueries } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { BRAND_IDS } from '@/config/brands.config'
import type { BrandId, NewsItem, NewsResponse } from '@/types'

/** Live headlines for every tracked brand, one cached request each (shared with the per-brand pages). */
export function useAllBrandNews() {
  const refreshMs = useAppStore((s) => s.refreshMs)
  const results = useQueries({
    queries: BRAND_IDS.map((brand) => ({
      queryKey: ['news', brand, 'brand'],
      queryFn: async ({ signal }: { signal: AbortSignal }): Promise<NewsResponse> => {
        const res = await fetch(`/api/news?brand=${brand}&filter=brand`, { signal })
        if (!res.ok) throw new Error(`News request failed (${res.status})`)
        return res.json()
      },
      refetchInterval: refreshMs,
      staleTime: 60_000,
    })),
  })
  const byBrand = Object.fromEntries(BRAND_IDS.map((id, i) => [id, results[i].data?.data ?? []])) as Record<BrandId, NewsItem[]>
  return {
    byBrand,
    loading: results.some((r) => r.isLoading),
    loaded: results.filter((r) => r.data).length,
    fetchedAt: results.map((r) => r.data?.meta.fetchedAt).filter(Boolean).sort().pop() as string | undefined,
  }
}
