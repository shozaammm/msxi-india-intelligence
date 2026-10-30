'use client'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useAppStore } from '@/lib/store'
import { useNewsData } from '@/hooks/useNewsData'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { BRAND_MODELS, type BodyType } from '@/config/models.config'
import { lineupStats, rankModels } from '@/lib/models'
import { getBrandIntel } from '@/lib/intel'
import { SourceNote } from '@/components/ui/SourceNote'
import { StatusTag } from '@/components/ui/StatusTag'
import { cn, relativeTime, youtubeSearchUrl } from '@/lib/utils'

export default function ModelsPage() {
  const brand = useAppStore((s) => s.activeBrand)
  const cfg = BRAND_CONFIGS[brand]
  const { models, provenance } = BRAND_MODELS[brand]
  const { data, isLoading } = useNewsData(brand)
  const [body, setBody] = useState<BodyType | 'All'>('All')

  const ranked = useMemo(() => rankModels(brand, data?.data ?? []), [brand, data])
  const stats = lineupStats(models)
  const bodies = useMemo(() => ['All', ...Array.from(new Set(models.map((m) => m.body)))] as (BodyType | 'All')[], [models])
  const shown = ranked.filter((r) => body === 'All' || r.model.body === body)
  const maxMentions = Math.max(1, ...ranked.map((r) => r.hits.length))
  const sales = getBrandIntel(brand).annualSales

  const figures = [
    { label: 'Models on sale', value: String(stats.total) },
    { label: 'SUVs', value: String(stats.suvs) },
    { label: 'Fully electric', value: String(stats.electric) },
    { label: 'Upcoming', value: stats.upcoming ? String(stats.upcoming) : '—' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">Models</p>
        <h1 className="display text-[clamp(36px,4vw,56px)] text-fg">What {cfg.switchLabel} sells in India</h1>
        <p className="mt-2 max-w-[60ch] text-[15px] text-fg-2">
          Every model we could confirm, ranked by how many of the latest headlines mention it. The rank is coverage, not sales: brands do not publish model-wise numbers.
          {sales.status === 'reported' && <> {cfg.name} sold {sales.value.units.toLocaleString('en-IN')} cars ({sales.value.period ?? `calendar ${sales.value.year}`}); model-wise sales are not published.</>}
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-6 border-y border-line/[0.1] py-6 sm:grid-cols-4">
        {figures.map((f) => (
          <div key={f.label}>
            <dt className="text-[13px] font-medium text-fg-3">{f.label}</dt>
            <dd className="num display mt-1 text-[44px] leading-none text-fg">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by body type">
        {bodies.map((b) => <button key={b} aria-pressed={body === b} onClick={() => setBody(b)} className="chip-btn">{b === 'All' ? 'All models' : b}</button>)}
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shown.map(({ model: m, hits, rank }, i) => {
          const latest = hits[0]
          return (
            <motion.li key={m.name} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.03, type: 'spring', stiffness: 160, damping: 22 }} className="card flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="num display text-[30px] text-fg-3" title="Rank by coverage in the latest headlines">{rank ?? '–'}</span>
                  <h2 className="display text-[30px] text-fg">{m.name}</h2>
                </div>
                {m.status === 'upcoming' && <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">Upcoming</span>}
                {m.status === 'check' && <span className="rounded-full bg-warn/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-warn" title={m.note}>Check</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full px-3 py-1 text-[12.5px] font-semibold text-fg ring-1 ring-fg/40">{m.body}</span>
                {m.power.map((p) => <span key={p} className={cn('rounded-full px-3 py-1 text-[12.5px] font-medium ring-1', p === 'Electric' ? 'text-pos ring-pos/40' : 'text-fg-2 ring-fg/20')}>{p}</span>)}
              </div>
              {m.bestSeller && (
                <a href={m.bestSeller.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex self-start rounded-full bg-accent/15 px-3 py-1 text-[12px] font-semibold text-accent">
                  Reported best seller · {m.bestSeller.period}
                </a>
              )}
              {m.note && <p className="mt-3 text-[13px] leading-relaxed text-fg-3">{m.note}</p>}

              <div className="mt-5 border-t border-line/[0.08] pt-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] font-medium text-fg-3">In the latest headlines</p>
                  <p className="num text-[20px] font-semibold text-fg">{isLoading ? '…' : hits.length}</p>
                </div>
                <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
                  <motion.span className="block h-full origin-left rounded-full" style={{ background: cfg.accentColor }} initial={{ scaleX: 0 }} animate={{ scaleX: hits.length / maxMentions }} transition={{ type: 'spring', stiffness: 90, damping: 20 }} />
                </span>
                {latest ? (
                  <a href={latest.url} target="_blank" rel="noopener noreferrer" className="mt-3 block text-[14px] leading-snug text-fg hover:underline underline-offset-4">
                    {latest.headline}
                    <span className="mt-1 block text-[12px] text-fg-3">{latest.source} · {relativeTime(latest.isoTimestamp)}</span>
                  </a>
                ) : (
                  !isLoading && <p className="mt-3 text-[13px] text-fg-3">Not mentioned in the latest headlines.</p>
                )}
              </div>

              <a href={youtubeSearchUrl(`${cfg.switchLabel} ${m.name} India review`)} target="_blank" rel="noopener noreferrer" className="link-line mt-5 inline-flex items-center gap-1 self-start text-[13.5px] text-fg">
                Watch reviews <ArrowUpRight className="h-3.5 w-3.5" weight="bold" />
              </a>
            </motion.li>
          )
        })}
      </ul>

      <div className="flex flex-col gap-2 rounded-card bg-panel px-6 py-5 ring-1 ring-line/[0.06]">
        <div className="flex items-center gap-3"><StatusTag status="reported" note={provenance.note} /><p className="text-[13.5px] text-fg-2">Prices are left out on purpose: listing sites disagreed by lakhs on the same model. Lineups change, so confirm on the {cfg.switchLabel} India site before quoting.</p></div>
        <SourceNote p={provenance} />
      </div>
    </div>
  )
}
