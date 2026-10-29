'use client'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNewsData } from '@/hooks/useNewsData'
import { TOPICS } from '@/lib/topics'
import { Panel } from '@/components/ui/Panel'
import { StatusTag } from '@/components/ui/StatusTag'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { BrandId, NewsItem } from '@/types'

export function topicCounts(items: NewsItem[]) {
  return TOPICS.map((t) => ({ ...t, count: items.filter((i) => i.topics.includes(t.id)).length }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
}

/**
 * What the brand's coverage is about, counted from the live headlines.
 * Counts, not "sentiment": a handful of articles can't support a score.
 */
export function CoveragePulse({
  brand, className, selected, onSelect,
}: { brand: BrandId; className?: string; selected?: string | null; onSelect?: (id: string | null) => void }) {
  const { data, isLoading } = useNewsData(brand)
  const items = useMemo(() => data?.data ?? [], [data])
  const topics = useMemo(() => topicCounts(items), [items])
  const max = topics[0]?.count ?? 1

  return (
    <Panel
      title="What the coverage is about"
      kicker="Pulse"
      className={className}
      action={data && <StatusTag status={data.meta.stale ? 'stale' : 'live'} note="Counted from the headlines currently in the feed" />}
      footer={<p className="text-[11.5px] text-fg-3">{items.length} brand stories, tagged by keyword rules. One story can carry several topics.</p>}
    >
      {isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-5" />)}</div>
      ) : topics.length === 0 ? (
        <p className="py-6 text-[12.5px] text-fg-3">No tagged stories yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {topics.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                disabled={!onSelect}
                aria-pressed={selected === t.id}
                onClick={() => onSelect?.(selected === t.id ? null : t.id)}
                className={cn('grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-tile px-1.5 py-1.5 text-left transition-colors', onSelect && 'hover:bg-fg/[0.04]', selected === t.id && 'bg-fg/[0.05]')}
              >
                <span className="text-[13px] text-fg-2">{t.label}</span>
                <span className="num text-[12.5px] text-fg">{t.count}</span>
                <span className="col-span-2 block h-[5px] overflow-hidden rounded-full bg-fg/[0.05]">
                  <motion.span
                    className={cn('block h-full origin-left rounded-full', i === 0 ? 'bg-accent' : 'bg-fg/25')}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: t.count / max }}
                    transition={{ type: 'spring', stiffness: 90, damping: 20, delay: i * 0.04 }}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
