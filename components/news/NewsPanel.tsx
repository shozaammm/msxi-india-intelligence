'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useNewsData } from '@/hooks/useNewsData'
import { useAppStore } from '@/lib/store'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { ErrorCard, EmptyState } from '@/components/ui/ErrorCard'
import { NewsSkeleton } from '@/components/ui/Skeleton'
import { NewsList } from './NewsList'
import { relativeTime } from '@/lib/utils'
import type { RegionFilter } from '@/config/feeds.config'
import type { BrandId, NewsItem } from '@/types'

type Tab = 'brand' | 'general'

export function NewsPanel({ brand, className, limit, query = '' }: { brand: BrandId; className?: string; limit?: number; query?: string }) {
  const { defaultRegion, watchKeywords } = useAppStore()
  const [tab, setTab] = useState<Tab>('brand')
  const [region, setRegion] = useState<RegionFilter>(defaultRegion)
  const { data, isLoading, isError, refetch } = useNewsData(brand, tab)

  const all = useMemo(() => data?.data ?? [], [data])
  const byQuery = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? all.filter((i) => `${i.headline} ${i.snippet} ${i.source}`.toLowerCase().includes(q)) : all
  }, [all, query])
  const counts = useMemo(() => ({
    all: byQuery.length,
    india: byQuery.filter((i) => i.region === 'india').length,
    global: byQuery.filter((i) => i.region === 'global').length,
  }), [byQuery])
  const items: NewsItem[] = useMemo(() => {
    const list = region === 'all' ? byQuery : byQuery.filter((i) => i.region === region)
    return limit ? list.slice(0, limit) : list
  }, [byQuery, region, limit])

  const meta = data?.meta
  return (
    <Panel
      title={tab === 'brand' ? `${BRAND_CONFIGS[brand].name.split(' ')[0]} in the news` : 'Industry wire'}
      kicker="Headlines"
      className={className}
      bodyClassName="flex flex-col overflow-hidden pb-0"
      action={meta && <StatusTag status={meta.stale ? 'stale' : 'live'} note={`${meta.feedsOk} of ${meta.feedsTotal} feeds responded · updated ${relativeTime(meta.fetchedAt)}`} />}
      footer={
        <div className="flex items-center justify-between text-[11.5px] text-fg-3">
          <span>Headlines and short excerpts link to the publisher. We don&apos;t store full articles.</span>
          {limit && <Link href="/news" className="shrink-0 text-fg-2 underline-offset-2 hover:text-fg hover:underline">All headlines</Link>}
        </div>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <div className="flex rounded-[9px] bg-ink p-0.5 ring-1 ring-line/[0.07]" role="tablist">
          {(['brand', 'general'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-[7px] px-3 py-1 text-[12.5px] font-medium transition-colors ${tab === t ? 'bg-raised text-fg shadow-card' : 'text-fg-3 hover:text-fg-2'}`}
            >
              {t === 'brand' ? 'Brand' : 'Industry'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(['all', 'india', 'global'] as const).map((r) => (
            <button key={r} aria-pressed={region === r} onClick={() => setRegion(r)} className="chip-btn">
              {r === 'all' ? 'All' : r === 'india' ? 'India' : 'Global'} <span className="num ml-0.5 opacity-60">{counts[r]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-5 min-h-0 flex-1 overflow-y-auto px-5">
        {isLoading && <NewsSkeleton />}
        {isError && <ErrorCard source="the news feeds" onRetry={() => refetch()} />}
        {!isLoading && !isError && items.length === 0 && (
          <EmptyState title={query ? `Nothing matches “${query}”` : 'No stories in this view yet'}>
            {query ? 'Try a shorter term, or switch to Industry or Global.' : 'Publishers update through the day. Try Global or Industry, or check back shortly.'}
          </EmptyState>
        )}
        {!isLoading && items.length > 0 && <NewsList items={items} highlightWords={[...watchKeywords, query]} dense={Boolean(limit)} />}
      </div>
    </Panel>
  )
}
