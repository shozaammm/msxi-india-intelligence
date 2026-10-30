'use client'
import { OverviewHero } from '@/components/overview/OverviewHero'
import { SalesRanking } from '@/components/overview/SalesRanking'
import { TopModelSales } from '@/components/overview/TopModelSales'
import { NewsRace } from '@/components/overview/NewsRace'
import { LineupMatrix } from '@/components/overview/LineupMatrix'
import { LatestAcross } from '@/components/overview/LatestAcross'

export default function OverviewPage() {
  return (
    <>
      <OverviewHero />
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-12 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="flex flex-col gap-6 xl:col-span-7">
            <SalesRanking />
            <TopModelSales />
            <NewsRace />
          </div>
          <div className="flex flex-col gap-6 xl:col-span-5">
            <LineupMatrix />
            <LatestAcross />
          </div>
        </div>
      </div>
    </>
  )
}
