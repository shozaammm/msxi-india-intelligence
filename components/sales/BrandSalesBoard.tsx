'use client'
import { motion } from 'framer-motion'
import { BRAND_CONFIGS, BRAND_IDS } from '@/config/brands.config'
import { BASIS_LABEL, BRAND_SALES, type PeriodId } from '@/config/sales.config'
import { brandCsv, missingBrands, periodById, rankBrands, yoy } from '@/lib/sales'
import { BrandMark } from '@/components/ui/BrandMark'
import { StatusTag } from '@/components/ui/StatusTag'
import { SourceNote } from '@/components/ui/SourceNote'
import { cn, formatSignedPct, formatUnits } from '@/lib/utils'

/** Brands ranked by cars sold in the chosen period. */
export function BrandSalesBoard({ period }: { period: PeriodId }) {
  const meta = BRAND_SALES[period]
  const rows = rankBrands(period)
  const missing = missingBrands(period, BRAND_IDS)
  const max = rows[0]?.units ?? 1
  const p = periodById(period)

  const download = () => {
    const url = URL.createObjectURL(new Blob([brandCsv(period)], { type: 'text/csv' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `india-luxury-sales-${period}.csv` })
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!meta) return <p className="py-6 text-[14px] text-fg-3">No brand-wise figures published for {p.span} yet.</p>

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-fg-2">{p.span} · <span className="font-semibold">{BASIS_LABEL[meta.basis]}</span></p>
        <div className="flex items-center gap-2">
          <StatusTag status="reported" />
          <button onClick={download} className="chip-btn">Download CSV</button>
        </div>
      </div>
      <ol className="mt-2 divide-y divide-line/[0.08]">
        {rows.map((r, i) => {
          const y = yoy(r)
          const b = BRAND_CONFIGS[r.brand]
          return (
            <li key={r.brand} className="grid grid-cols-[28px_40px_1fr_auto] items-center gap-4 py-3.5">
              <span className="num display text-[26px] text-fg-3">{r.rank}</span>
              <BrandMark brand={r.brand} size="sm" className="!h-10 !w-10" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <p className="text-[16px] font-semibold text-fg">{b.name}</p>
                  <p className="text-[13px] text-fg-3">{r.sharePct.toFixed(1)}% of listed brands</p>
                </div>
                <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-fg/[0.07]">
                  <motion.span key={`${period}-${r.brand}`} className="block h-full origin-left rounded-full" style={{ background: b.accentColor }} initial={{ scaleX: 0 }} animate={{ scaleX: r.units / max }} transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.05 * i }} />
                </span>
                {r.note && <p className="mt-1 text-[12px] text-fg-3">{r.note}</p>}
              </div>
              <div className="text-right">
                <p className="num display text-[28px] leading-none text-fg">{formatUnits(r.units)}</p>
                {y !== null ? (
                  <p className={cn('num mt-1 text-[13px] font-semibold', y >= 0 ? 'text-pos' : 'text-neg')}>{formatSignedPct(y)} YoY</p>
                ) : (
                  <p className="mt-1 text-[12px] text-fg-3">no prior year</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      {missing.length > 0 && (
        <p className="mt-3 text-[13px] text-fg-3">
          Not published for this period: {missing.map((m) => BRAND_CONFIGS[m].name).join(', ')}.
        </p>
      )}
      {meta.note && <p className="mt-2 text-[12.5px] text-fg-3">{meta.note}</p>}
      <SourceNote className="mt-2 block" p={{ status: 'reported', source: meta.source, sourceUrl: meta.sourceUrl, asOf: meta.asOf }} />
    </div>
  )
}
