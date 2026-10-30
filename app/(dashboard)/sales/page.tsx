'use client'
import { useState } from 'react'
import { Panel } from '@/components/ui/Panel'
import { PeriodTabs } from '@/components/sales/PeriodTabs'
import { BrandSalesBoard } from '@/components/sales/BrandSalesBoard'
import { ModelSalesBoard } from '@/components/sales/ModelSalesBoard'
import { BodySplit, GapTracker, HeadToHead, ReportedVsRegistered } from '@/components/sales/SalesExtras'
import { periodById } from '@/lib/sales'
import type { PeriodId } from '@/config/sales.config'

export default function SalesPage() {
  const [period, setPeriod] = useState<PeriodId>('h12026')
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-3">Cars sold</p>
        <h1 className="display mt-2 text-[48px] text-fg">Sales rankings.</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-fg-2">
          Brands and models ranked by units sold in India. Pick a period. Every figure is copied from a cited source and labelled retail (VAHAN) or company-reported. Where a brand or period is not published, it says so.
        </p>
      </header>
      <PeriodTabs value={period} onChange={setPeriod} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-7">
          <Panel title="Brands ranked" kicker={periodById(period).label}>
            <BrandSalesBoard period={period} />
          </Panel>
          <Panel title="Models ranked" kicker="Best-selling cars">
            <ModelSalesBoard period={period} />
          </Panel>
        </div>
        <div className="flex flex-col gap-6 xl:col-span-5">
          <HeadToHead />
          <GapTracker />
          <ReportedVsRegistered />
          <BodySplit />
        </div>
      </div>
    </div>
  )
}
