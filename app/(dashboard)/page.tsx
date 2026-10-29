'use client'
import { useAppStore } from '@/lib/store'
import { MarketPanel } from '@/components/market/MarketPanel'
import { MarketplacePanel } from '@/components/marketplace/MarketplacePanel'
import { NewsPanel } from '@/components/news/NewsPanel'

export default function DashboardOverview() {
  const activeBrand = useAppStore(state => state.activeBrand)

  return (
    <div className="flex-1 grid overflow-hidden h-full min-h-[800px] gap-6 p-6" style={{ gridTemplateColumns: '55% 45%' }}>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#13121E] shadow-2xl flex flex-col">
        <MarketPanel brand={activeBrand}/>
      </div>
      <div className="grid overflow-hidden h-full gap-6" style={{ gridTemplateRows: '1fr 1fr' }}>
        <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#13121E] shadow-2xl flex flex-col">
          <MarketplacePanel brand={activeBrand}/>
        </div>
        <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#13121E] shadow-2xl flex flex-col">
          <NewsPanel brand={activeBrand}/>
        </div>
      </div>
    </div>
  )
}
