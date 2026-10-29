'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MarketplacePanel } from '@/components/marketplace/MarketplacePanel'
import { useMarketData } from '@/hooks/useMarketData'
import { motion, AnimatePresence } from 'framer-motion'

export default function SentimentPage() {
  const activeBrand = useAppStore(state => state.activeBrand)
  const { data, isLoading } = useMarketData(activeBrand)
  const [filterType, setFilterType] = useState<'all' | 'pros' | 'cons'>('all')

  return (
    <div className="flex-1 grid overflow-hidden h-full min-h-[800px] gap-6 p-6" style={{ gridTemplateColumns: '55% 45%' }}>
      {/* Left panel: Sentiment Hub Card */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#13121E] shadow-sm flex flex-col h-full">
        <MarketplacePanel brand={activeBrand} />
      </div>

      {/* Right panel: Advanced consensus and review analytics */}
      <div className="rounded-xl border border-white/[0.08] bg-[#13121E] p-6 flex flex-col justify-between shadow-sm h-full relative overflow-hidden">
        {/* Soft radial design glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C5A880]/[0.02] blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/[0.07] pb-4">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">CONSENSUS MODEL</span>
            <h2 className="text-xl font-bold text-[#EDE9DF] mt-1">Critic Sentiment Dynamics</h2>
          </div>

          {/* Filtering Sentiment Pillars */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold text-[#EDE9DF]/40 uppercase tracking-[0.05em] block">Select Consensus Area</span>
            <div className="flex bg-white/[0.04] p-0.5 rounded border border-white/[0.08]">
              {(['all', 'pros', 'cons'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`flex-1 text-[10px] font-bold px-3 py-2 rounded transition-all capitalize ${
                    filterType === t ? 'bg-[#C5A880] text-[#0D0C14]' : 'text-[#EDE9DF]/50 hover:text-[#EDE9DF]'
                  }`}
                >
                  {t} consensus
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Sentiment Lists */}
          {!isLoading && data && (
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 no-scrollbar max-h-[360px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={filterType}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  {(filterType === 'all' || filterType === 'pros') && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-[#3DB87A] uppercase tracking-wider">High Sentiment Pillars</span>
                      {data.userSentimentPositives.map((pos) => (
                        <div key={pos} className="bg-[#15231D]/30 border border-[#3DB87A]/15 p-3 rounded-lg text-xs leading-relaxed text-[#EDE9DF]/80 hover:bg-[#15231D]/50 transition-colors">
                          <span className="text-[#3DB87A] font-bold mr-1.5">✓</span>
                          {pos}
                        </div>
                      ))}
                    </div>
                  )}

                  {(filterType === 'all' || filterType === 'cons') && (
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-[10px] font-bold text-[#D95454] uppercase tracking-wider">Low Sentiment Pillars</span>
                      {data.userSentimentNegatives.map((neg) => (
                        <div key={neg} className="bg-[#241A1A]/30 border border-[#D95454]/15 p-3 rounded-lg text-xs leading-relaxed text-[#EDE9DF]/80 hover:bg-[#241A1A]/50 transition-colors">
                          <span className="text-[#D95454] font-bold mr-1.5">✗</span>
                          {neg}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Dynamic status footer */}
        <div className="border-t border-white/[0.07] pt-4 mt-6 flex items-center justify-between text-[11px] text-[#EDE9DF]/40">
          <span>Surveyed on Team-BHP & CarWale</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22C55E]"></span>
            Active Consensus High
          </span>
        </div>
      </div>
    </div>
  )
}
