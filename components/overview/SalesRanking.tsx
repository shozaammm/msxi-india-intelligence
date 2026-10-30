'use client'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { getBrandIntel } from '@/lib/intel'
import { Panel } from '@/components/ui/Panel'
import { BrandMark } from '@/components/ui/BrandMark'
import { StatusTag } from '@/components/ui/StatusTag'
import { SourceNote } from '@/components/ui/SourceNote'
import { comparableSales } from './OverviewHero'
import { cn, formatSignedPct, formatUnits } from '@/lib/utils'
import type { BrandId } from '@/types'

function Row({ id, rank, max }: { id: BrandId; rank?: number; max: number }) {
  const b = BRAND_CONFIGS[id]
  const { annualSales } = getBrandIntel(id)
  const s = annualSales.value
  const published = annualSales.status !== 'unavailable'
  return (
    <li className="grid grid-cols-[28px_40px_1fr_auto] items-center gap-4 py-3.5">
      <span className="num display text-[26px] text-fg-3">{rank ?? '–'}</span>
      <BrandMark brand={id} size="sm" className="!h-10 !w-10" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <p className="text-[16px] font-semibold text-fg">{b.name}</p>
          <p className="text-[13px] text-fg-3">{s.period ?? (published ? `calendar ${s.year}` : 'not published')}</p>
        </div>
        <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
          {published && (
            <motion.span
              className="block h-full origin-left rounded-full bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: s.units / max }}
              transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.1 }}
              style={{ background: b.accentColor }}
            />
          )}
        </span>
      </div>
      <div className="text-right">
        <p className="num display text-[28px] leading-none text-fg">{published ? formatUnits(s.units) : '—'}</p>
        {published && <p className={cn('num mt-1 text-[13px] font-semibold', s.yoyPct >= 0 ? 'text-pos' : 'text-neg')}>{formatSignedPct(s.yoyPct)}</p>}
      </div>
    </li>
  )
}

export function SalesRanking() {
  const ranked = comparableSales()
  const rankedIds = new Set<BrandId>(ranked.map((r) => r.id))
  const rest = BRAND_IDS.filter((id) => !rankedIds.has(id)).sort((a, b) => {
    const ua = getBrandIntel(a).annualSales, ub = getBrandIntel(b).annualSales
    return (ub.status === 'unavailable' ? -1 : ub.value.units) - (ua.status === 'unavailable' ? -1 : ua.value.units)
  })
  const max = Math.max(...BRAND_IDS.map((id) => getBrandIntel(id).annualSales.value.units), 1)

  return (
    <Panel title="Sales ranking" kicker="Cars sold in India" action={<StatusTag status="reported" />}>
      <p className="mb-1 text-[13px] font-semibold text-fg-2">Calendar 2025, ranked</p>
      <ol className="divide-y divide-line/[0.08]">
        {ranked.map((r, i) => <Row key={r.id} id={r.id} rank={i + 1} max={max} />)}
      </ol>

      <p className="mb-1 mt-6 text-[13px] font-semibold text-fg-2">Latest published, not ranked</p>
      <p className="mb-1 text-[12.5px] text-fg-3">These brands have no calendar 2025 figure we could source. Their numbers cover other periods, so ranking them against the list above would mislead.</p>
      <ul className="divide-y divide-line/[0.08]">
        {rest.map((id) => <Row key={id} id={id} max={max} />)}
      </ul>

      <div className="mt-5 flex flex-col gap-1 border-t border-line/[0.08] pt-4">
        {BRAND_IDS.map((id) => <SourceNote key={id} p={getBrandIntel(id).annualSales} prefix={BRAND_CONFIGS[id].switchLabel} />)}
      </div>
    </Panel>
  )
}
