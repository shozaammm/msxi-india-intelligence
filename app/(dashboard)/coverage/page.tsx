'use client'
import { useMemo, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useNewsData } from '@/hooks/useNewsData'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { CoveragePulse } from '@/components/coverage/CoveragePulse'
import { NewsList } from '@/components/news/NewsList'
import { Panel } from '@/components/ui/Panel'
import { NewsSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/ErrorCard'
import { topicLabel } from '@/lib/topics'
import { youtubeSearchUrl } from '@/lib/utils'

export default function CoveragePage() {
  const brand = useAppStore((s) => s.activeBrand)
  const cfg = BRAND_CONFIGS[brand]
  const { data, isLoading } = useNewsData(brand)
  const [topic, setTopic] = useState<string | null>(null)
  const items = useMemo(() => {
    const all = data?.data ?? []
    return topic ? all.filter((i) => i.topics.includes(topic)) : all
  }, [data, topic])

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">Coverage</p>
        <h1 className="display text-[clamp(36px,4vw,56px)] text-fg">What people are writing about {cfg.name.split(' ')[0]}</h1>
        <p className="mt-1 max-w-[68ch] text-[13px] leading-relaxed text-fg-2">
          Counted from live headlines. We don&apos;t score sentiment or quote reviewers: a few dozen articles can&apos;t support a score, and quotes belong to the people who said them. Follow the links to read and watch the originals.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">
          <CoveragePulse brand={brand} selected={topic} onSelect={setTopic} />
          <Panel title="Watch the reviews" kicker="Video" footer={<p className="text-[11.5px] text-fg-3">Opens a YouTube search. We link out rather than summarise.</p>}>
            <ul className="flex flex-col">
              {cfg.reviewModels.map((m) => (
                <li key={m} className="hairline border-b last:border-0">
                  <a href={youtubeSearchUrl(`${cfg.name.replace(' India', '')} ${m} review India`)} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-2.5 text-[13px] text-fg-2 transition-colors hover:text-fg">
                    {m} review
                    <span className="text-[12px] text-fg-3 transition-transform group-hover:translate-x-0.5">YouTube ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title={topic ? topicLabel(topic) : 'All brand stories'}
          kicker="Stories"
          action={topic && <button onClick={() => setTopic(null)} className="chip-btn">Show all</button>}
          bodyClassName="max-h-[calc(100dvh-280px)] overflow-y-auto"
        >
          {isLoading ? <NewsSkeleton /> : items.length ? <NewsList items={items} /> : <EmptyState title="No stories on this topic yet" />}
        </Panel>
      </div>
    </div>
  )
}
