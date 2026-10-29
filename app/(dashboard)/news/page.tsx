'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { NewsPanel } from '@/components/news/NewsPanel'
import { useNewsData } from '@/hooks/useNewsData'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

export default function NewsPage() {
  const activeBrand = useAppStore(state => state.activeBrand)
  const { data: newsData } = useNewsData(activeBrand)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter sources for stats
  const sourceStats = newsData ? newsData.reduce((acc, curr) => {
    acc[curr.source] = (acc[curr.source] || 0) + 1
    return acc;
  }, {} as Record<string, number>) : {}

  const sortedSources = Object.entries(sourceStats).sort((a, b) => b[1] - a[1])

  return (
    <div className="flex-1 grid overflow-hidden h-full min-h-[800px] gap-6 p-6" style={{ gridTemplateColumns: '60% 40%' }}>
      {/* Left panel: Direct live intelligence feed */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#13121E] shadow-sm flex flex-col h-full">
        <NewsPanel brand={activeBrand} />
      </div>

      {/* Right panel: Keyword search & Source distribution */}
      <div className="rounded-xl border border-white/[0.08] bg-[#13121E] p-6 flex flex-col justify-between shadow-sm h-full relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C5A880]/[0.02] blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/[0.07] pb-4">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">AGGREGATOR SHELL</span>
            <h2 className="text-xl font-bold text-[#EDE9DF] mt-1">Intelligence Distribution</h2>
          </div>

          {/* Interactive Search Tool */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-[#EDE9DF]/40" />
            <input
              type="text"
              placeholder="Search feed headlines & content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-[#EDE9DF] placeholder-[#EDE9DF]/30 focus:outline-none focus:border-[#C5A880]/50 transition-colors"
            />
          </div>

          {/* Search results popup/panel */}
          {searchQuery && newsData && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 max-h-56 overflow-y-auto no-scrollbar">
              <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">Search Matches</span>
              {newsData.filter(n => n.headline.toLowerCase().includes(searchQuery.toLowerCase())).map((match) => (
                <a
                  key={match.id}
                  href={match.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#EDE9DF]/80 hover:text-[#EDE9DF] border-b border-white/[0.04] pb-2 last:border-0 leading-relaxed"
                >
                  <span className="text-[#C5A880] font-bold block text-[10px] uppercase mb-0.5">{match.source}</span>
                  {match.headline}
                </a>
              ))}
            </div>
          )}

          {/* Active Publishing Sources */}
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <span className="text-[11px] font-bold text-[#EDE9DF]/40 uppercase tracking-[0.05em] block">Active Publishing Sources</span>
            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 no-scrollbar max-h-72">
              {sortedSources.slice(0, 6).map(([source, count], idx) => (
                <div key={source} className="flex items-center justify-between text-xs text-[#EDE9DF]/85 bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#EDE9DF]/45 tabular-nums">0{idx + 1}</span>
                    <span className="font-semibold">{source}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#C5A880] bg-[#C5A880]/[0.08] px-2 py-0.5 rounded border border-[#C5A880]/20">
                    {count} stories
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic status footer */}
        <div className="border-t border-white/[0.07] pt-4 mt-6 flex items-center justify-between text-[11px] text-[#EDE9DF]/40">
          <span>Confidential Feed Aggregator</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22C55E]"></span>
            Aggregating 29 sources
          </span>
        </div>
      </div>
    </div>
  )
}
