'use client'
import { useMemo } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useAppStore } from '@/lib/store'
import { useNewsData } from '@/hooks/useNewsData'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { BrandMark } from '@/components/ui/BrandMark'
import { Panel } from '@/components/ui/Panel'
import { NewsList } from '@/components/news/NewsList'
import { NewsSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/ErrorCard'

export default function BrandHubPage() {
  const brand = useAppStore((s) => s.activeBrand)
  const cfg = BRAND_CONFIGS[brand]
  const { data, isLoading } = useNewsData(brand)
  const launches = useMemo(() => (data?.data ?? []).filter((i) => i.topics.some((t) => t === 'launch' || t === 'performance')).slice(0, 10), [data])

  return (
    <div className="flex flex-col gap-5">
      <section className="card relative overflow-hidden px-8 py-9">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgb(var(--accent)/0.12),transparent_60%)]" />
        <div className="relative flex flex-wrap items-center gap-7">
          <BrandMark brand={brand} size="xl" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">Brand hub</p>
            <h1 className="display text-[clamp(36px,4vw,56px)] text-fg">{cfg.name}</h1>
            <p className="text-[13px] text-fg-3">{cfg.fullName} · <span className="num">{cfg.ticker}</span></p>
          </div>
          {cfg.subLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cfg.subLogo} alt="Mercedes-AMG" className="ml-auto hidden h-5 w-auto opacity-60 brightness-0 md:block [[data-theme=dark]_&]:invert" />
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">
          <Panel title="Official sources" kicker="Go direct">
            <ul className="flex flex-col">
              {cfg.officialLinks.map((l) => (
                <li key={l.url} className="hairline border-b last:border-0">
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-3 text-[13.5px] text-fg-2 transition-colors hover:text-fg">
                    {l.label}
                    <ArrowUpRight className="h-4 w-4 text-fg-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" weight="bold" />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Model line-up we watch" kicker="Models">
            <p className="flex flex-wrap gap-1.5">
              {cfg.reviewModels.map((m) => (
                <span key={m} className="rounded-tile bg-fg/[0.05] px-2 py-1 text-[12.5px] text-fg-2">{m}</span>
              ))}
            </p>
          </Panel>
        </div>
        <Panel title="Launches and performance" kicker="Latest" bodyClassName="max-h-[560px] overflow-y-auto">
          {isLoading ? <NewsSkeleton rows={5} /> : launches.length ? <NewsList items={launches} /> : <EmptyState title="No launch or motorsport stories right now" />}
        </Panel>
      </div>
    </div>
  )
}
