'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { useMarketData } from '@/hooks/useMarketData'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowUpRight } from 'lucide-react'

export default function StatesPage() {
  const activeBrand = useAppStore(state => state.activeBrand)
  const { data, isLoading } = useMarketData(activeBrand)
  const [selectedStateIndex, setSelectedStateIndex] = useState<number | null>(null)

  const config = activeBrand === 'mercedes'
    ? { color: '#C5A880', label: 'Mercedes-Benz' }
    : { color: '#1C69D4', label: 'BMW' }

  return (
    <div className="flex-1 grid overflow-hidden h-full min-h-[800px] gap-6 p-6" style={{ gridTemplateColumns: '55% 45%' }}>
      {/* Left panel: Geographic registration leaderboard */}
      <div className="rounded-xl border border-white/[0.08] bg-[#13121E] p-6 flex flex-col justify-between shadow-sm h-full relative overflow-hidden">
        {/* Soft layout glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C5A880]/[0.02] blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="border-b border-white/[0.07] pb-4">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">REGISTRATION LEADERBOARD</span>
            <h2 className="text-xl font-bold text-[#EDE9DF] mt-1">VAHAN State Telemetry</h2>
          </div>

          {!isLoading && data && (
            <div className="flex flex-col gap-4 overflow-y-auto pr-1 no-scrollbar max-h-[460px]">
              {data.topStates.map((state, i) => (
                <div
                  key={state.stateName}
                  onClick={() => setSelectedStateIndex(i)}
                  className={`flex items-center gap-4 bg-white/[0.01] border p-4 rounded-xl cursor-pointer hover:bg-white/[0.03] transition-all ${
                    selectedStateIndex === i ? 'border-[#C5A880] bg-white/[0.04]' : 'border-white/[0.06]'
                  }`}
                >
                  <span className="text-[13px] font-bold text-[#EDE9DF]/40 w-6 text-right tabular-nums">0{i + 1}</span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm font-semibold text-[#EDE9DF]">
                      <span>{state.stateName}</span>
                      <span className="font-['Space_Grotesk',sans-serif] font-bold text-[#EDE9DF]">{state.registrationCount} units</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(to right, ${config.color}, #EDE9DF)`
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, state.marketSharePct * 2.5)}%` }}
                          transition={{ delay: i * 0.08, duration: 1.2 }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#3DB87A] bg-[#3DB87A]/[0.08] px-2 py-0.5 rounded border border-[#3DB87A]/20">
                        ↑ {state.yoyGrowthPct}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.07] pt-4 mt-6 flex items-center justify-between text-[11px] text-[#EDE9DF]/40">
          <span>Source: Ministry of Road Transport VAHAN Composite</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22C55E]"></span>
            Active VAHAN Stream
          </span>
        </div>
      </div>

      {/* Right panel: Active state detail analytics */}
      <div className="rounded-xl border border-white/[0.08] bg-[#13121E] p-6 flex flex-col justify-between shadow-sm h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#C5A880]/[0.02] blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="border-b border-white/[0.07] pb-4">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C5A880]">REGIONAL INTELLIGENCE</span>
            <h2 className="text-xl font-bold text-[#EDE9DF] mt-1">Geographic Consensus</h2>
          </div>

          <AnimatePresence mode="wait">
            {selectedStateIndex !== null && data ? (
              <motion.div
                key={selectedStateIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5"
              >
                <div className="flex items-center gap-2 text-sm text-[#C5A880] font-bold uppercase tracking-wider">
                  <MapPin className="h-4.5 w-4.5" />
                  <span>{data.topStates[selectedStateIndex].stateName} Registry</span>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#EDE9DF]/45 uppercase">Monthly Segment Share</span>
                    <span className="font-['Space_Grotesk',sans-serif] font-bold text-[#EDE9DF] text-lg tabular-nums">
                      {data.topStates[selectedStateIndex].marketSharePct}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-white/[0.04] pt-3.5">
                    <span className="text-[#EDE9DF]/45 uppercase">YoY Volumetric Expansion</span>
                    <span className="font-bold text-[#3DB87A] flex items-center gap-1">
                      <ArrowUpRight className="h-4 w-4" />
                      +{data.topStates[selectedStateIndex].yoyGrowthPct}% Expansion
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#EDE9DF]/65 leading-relaxed bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
                  Registration telemetry indicates that {data.topStates[selectedStateIndex].stateName} remains a core market driver, contributing significantly to {config.label}&apos;s nationwide luxury automotive segment dominance.
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-[#EDE9DF]/40 text-center gap-3">
                <MapPin className="h-10 w-10 text-[#C5A880]/30" />
                <p className="text-xs max-w-[200px]">Select a state from the leaderboard to view geographical consensus</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Status footer */}
        <div className="border-t border-white/[0.07] pt-4 mt-6 text-[11px] text-[#EDE9DF]/40">
          <span>Active State Dashboard Scoped to India</span>
        </div>
      </div>
    </div>
  )
}
