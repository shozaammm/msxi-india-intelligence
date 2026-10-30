'use client'
import { useAppStore } from '@/lib/store'
import { BrandPill } from '@/components/layout/BrandSwitcher'
import { SalesHero } from '@/components/brief/SalesHero'
import { MonthlyChart } from '@/components/brief/MonthlyChart'
import { StatesList } from '@/components/brief/StatesList'
import { MarketStrip } from '@/components/brief/MarketStrip'
import { BrandSales } from '@/components/brief/BrandSales'
import { ModelRanking } from '@/components/brief/ModelRanking'
import { NewsPanel } from '@/components/news/NewsPanel'
import { CoveragePulse } from '@/components/coverage/CoveragePulse'

export default function TodayPage() {
  const brand = useAppStore((s) => s.activeBrand)

  return (
    <>
      <SalesHero brand={brand} />
      <BrandPill />
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-24 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="flex flex-col gap-6 xl:col-span-7">
            <BrandSales brand={brand} />
            <MarketStrip brand={brand} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <MonthlyChart brand={brand} />
              <StatesList brand={brand} />
            </div>
          </div>
          <div className="flex flex-col gap-6 xl:col-span-5">
            <NewsPanel brand={brand} limit={12} className="h-[640px]" />
            <ModelRanking brand={brand} />
            <CoveragePulse brand={brand} />
          </div>
        </div>
      </div>
    </>
  )
}
