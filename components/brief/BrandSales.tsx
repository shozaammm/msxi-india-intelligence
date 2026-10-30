'use client'
import { useState } from 'react'
import Link from 'next/link'
import { BRAND_CONFIGS } from '@/config/brands.config'
import { BRAND_SALES, type PeriodId } from '@/config/sales.config'
import { periodById, rankBrands, yoy } from '@/lib/sales'
import { Panel } from '@/components/ui/Panel'
import { PeriodTabs } from '@/components/sales/PeriodTabs'
import { ModelSalesBoard } from '@/components/sales/ModelSalesBoard'
import { cn, formatSignedPct, formatUnits } from '@/lib/utils'
import type { BrandId } from '@/types'

/** One brand: cars sold in the chosen period, its rank among published brands, and its best-selling models. */
export function BrandSales({ brand, className }: { brand: BrandId; className?: string }) {
  const [period, setPeriod] = useState<PeriodId>('h12026')
  const cfg = BRAND_CONFIGS[brand]
  const ranked = rankBrands(period)
  const row = ranked.find((r) => r.brand === brand)
  const y = row ? yoy(row) : null
  const meta = BRAND_SALES[period]

  return (
    <Panel
      title="Cars sold"
      kicker={`${cfg.switchLabel} in India`}
      className={className}
      footer={<p className="text-[12px] text-fg-3">All brands and extra charts: <Link href="/sales" className="underline underline-offset-2 hover:text-fg">Sales rankings</Link></p>}
    >
      <PeriodTabs value={period} onChange={setPeriod} />
      <div className="mt-5 rounded-[12px] bg-fg/[0.04] p-5">
        {row ? (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="num display text-[56px] leading-none text-fg">{formatUnits(row.units)}</p>
              <p className="mt-2 text-[13px] text-fg-3">{periodById(period).span}</p>
            </div>
            <div className="text-right">
              <p className="display text-[28px] text-fg">#{row.rank} <span className="text-[14px] text-fg-3">of {ranked.length} published</span></p>
              {y !== null && <p className={cn('num text-[14px] font-semibold', y >= 0 ? 'text-pos' : 'text-neg')}>{formatSignedPct(y)} YoY</p>}
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-fg-2">{cfg.name} has not published a figure for {periodById(period).span}{meta ? '' : ' (no brand has)'}. Try another period.</p>
        )}
      </div>
      <h3 className="display mb-1 mt-7 text-[22px] text-fg">Best-selling models</h3>
      <ModelSalesBoard period={period} brand={brand} showFilter={false} />
    </Panel>
  )
}
