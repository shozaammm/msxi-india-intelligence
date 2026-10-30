'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { BASIS_LABEL, MODEL_SALES, type PeriodId } from '@/config/sales.config'
import { periodById, rankModels } from '@/lib/sales'
import { StatusTag } from '@/components/ui/StatusTag'
import { SourceNote } from '@/components/ui/SourceNote'
import { cn, formatUnits } from '@/lib/utils'
import type { BrandId } from '@/types'

const LATEST: PeriodId = 'cy2025'

/**
 * Cars ranked by units sold. Model-wise units are published for calendar 2025 only,
 * so other periods say so and show the latest available year instead of guessing.
 */
export function ModelSalesBoard({ period, brand, limit, showFilter = true }: { period: PeriodId; brand?: BrandId; limit?: number; showFilter?: boolean }) {
  const [pick, setPick] = useState<BrandId | 'all'>('all')
  const effective: PeriodId = MODEL_SALES[period] ? period : LATEST
  const fallback = effective !== period
  const meta = MODEL_SALES[effective]!
  const filter = brand ?? (pick === 'all' ? undefined : pick)
  const rows = rankModels(effective, filter).slice(0, limit)
  const max = rankModels(effective, filter)[0]?.units ?? 1
  const brandsWithModels = BRAND_IDS.filter((id) => rankModels(effective, id).length > 0)

  return (
    <div>
      {fallback && (
        <p className="mb-3 rounded-[10px] bg-warn/10 px-3.5 py-2.5 text-[13px] text-warn">
          Model-wise units for {periodById(period).span} are not published yet. Showing {periodById(effective).span}, the latest year with model figures.
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-fg-2">{periodById(effective).span} · <span className="font-semibold">{BASIS_LABEL[meta.basis]}</span></p>
        <StatusTag status="reported" />
      </div>
      {showFilter && !brand && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="chip-btn" aria-pressed={pick === 'all'} onClick={() => setPick('all')}>All brands</button>
          {brandsWithModels.map((id) => (
            <button key={id} className="chip-btn" aria-pressed={pick === id} onClick={() => setPick(id)}>{BRAND_CONFIGS[id].switchLabel}</button>
          ))}
        </div>
      )}
      {rows.length === 0 ? (
        <p className="py-6 text-[14px] text-fg-3">
          {brand ? `${BRAND_CONFIGS[brand].name} has no model in the published top 20, and publishes no model-wise units itself.` : 'No models.'}
        </p>
      ) : (
        <ol className="mt-2 divide-y divide-line/[0.08]">
          {rows.map((r, i) => (
            <li key={`${r.brand}-${r.name}`} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 py-3">
              <span className="num display text-[26px] text-fg-3">{r.rank}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <p className="text-[16px] font-semibold text-fg">{!brand && `${BRAND_CONFIGS[r.brand].switchLabel} `}{r.name}</p>
                  <p className="text-[12.5px] text-fg-3">{r.body} · {r.sharePct.toFixed(1)}% of listed models</p>
                </div>
                <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
                  <motion.span key={`${effective}-${filter ?? 'all'}-${r.name}`} className="block h-full origin-left rounded-full" style={{ background: BRAND_CONFIGS[r.brand].accentColor }} initial={{ scaleX: 0 }} animate={{ scaleX: r.units / max }} transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.04 * i }} />
                </span>
              </div>
              <p className={cn('num text-[20px] font-semibold text-fg')}>{formatUnits(r.units)}</p>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-[12.5px] text-fg-3">{meta.note}</p>
      <SourceNote className="mt-2 block" p={{ status: 'reported', source: meta.source, sourceUrl: meta.sourceUrl, asOf: meta.asOf }} />
    </div>
  )
}
