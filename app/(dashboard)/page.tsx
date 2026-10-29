'use client'
import { useAppStore } from '@/lib/store'
import { SalesHero } from '@/components/brief/SalesHero'
import { MonthlyChart } from '@/components/brief/MonthlyChart'
import { StatesList } from '@/components/brief/StatesList'
import { MarketStrip } from '@/components/brief/MarketStrip'
import { NewsPanel } from '@/components/news/NewsPanel'
import { CoveragePulse } from '@/components/coverage/CoveragePulse'

export default function TodayPage() {
  const brand = useAppStore((s) => s.activeBrand)

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="flex flex-col gap-5 xl:col-span-7">
        <SalesHero brand={brand} />
        <MarketStrip brand={brand} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <MonthlyChart brand={brand} />
          <StatesList brand={brand} />
        </div>
      </div>
      <div className="flex flex-col gap-5 xl:col-span-5">
        <NewsPanel brand={brand} limit={12} className="h-[640px]" />
        <CoveragePulse brand={brand} />
      </div>
    </div>
  )
}
